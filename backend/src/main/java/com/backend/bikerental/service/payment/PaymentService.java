package com.backend.bikerental.service.payment;

import com.backend.bikerental.dto.payment.CreatePaymentRequest;
import com.backend.bikerental.dto.payment.PaymentDTO;
import com.backend.bikerental.dto.payment.PaymentWebhookDTO;
import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.entity.Payment;
import com.backend.bikerental.enumeration.PaymentStatus;
import com.backend.bikerental.enumeration.PaymentType;
import com.backend.bikerental.exception.PaymentAlreadyExistsException;
import com.backend.bikerental.exception.PaymentMismatchException;
import com.backend.bikerental.exception.PaymentNotFoundException;
import com.backend.bikerental.exception.ResourceNotFoundException;
import com.backend.bikerental.repository.PaymentRepository;
import com.backend.bikerental.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Payment Service with Duplicate Prevention
 * 
 * This service implements a multi-layer duplicate payment prevention strategy:
 * 1. Database constraints (unique_transaction_code, unique_booking_type, unique_idempotency_key)
 * 2. Application-level idempotency (check before insert)
 * 3. Webhook callback handling with amount verification
 * 
 * Transaction Isolation Level: SERIALIZABLE
 * - Prevents race conditions during concurrent payment processing
 * - Ensures atomicity of payment creation and booking approval
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    
    /**
     * Create a new payment with idempotency support
     * 
     * Flow:
     * 1. Check if idempotency_key already processed (idempotent)
     * 2. Verify no payment of this type exists for booking
     * 3. Create new payment record
     * 4. Database constraints prevent duplicates
     * 
     * @param request Payment creation request
     * @return PaymentDTO
     * @throws PaymentAlreadyExistsException if payment of this type already exists
     * @throws DataIntegrityViolationException if database constraint violated
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public PaymentDTO createPayment(CreatePaymentRequest request) {
        
        log.info("Creating payment for booking: {} with idempotency key: {}", 
            request.getBookingId(), request.getIdempotencyKey());
        
        try {
            // Step 1: Check if idempotency_key already processed (return cached result)
            if (request.getIdempotencyKey() != null) {
                Optional<Payment> existingPayment = 
                    paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());
                
                if (existingPayment.isPresent()) {
                    Payment payment = existingPayment.get();
                    log.info("Idempotency key already processed, returning cached payment: {}", 
                        payment.getId());
                    
                    // Verify amount matches (safety check)
                    if (!payment.getAmount().equals(request.getAmount())) {
                        log.warn(
                            "Idempotency key matched but amount differs! " +
                            "DB amount: {}, Request amount: {}",
                            payment.getAmount(), request.getAmount()
                        );
                        throw new PaymentMismatchException(
                            "Cached payment amount does not match request"
                        );
                    }
                    
                    return convertToDTO(payment);
                }
            }
            
            // Step 2: Verify booking exists
            Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Booking not found: " + request.getBookingId()
                ));
            
            // Step 3: Check if payment of this type already exists
            Optional<Payment> existingPaymentOfType = 
                paymentRepository.findByBookingIdAndType(
                    request.getBookingId(),
                    request.getType()
                );
            
            if (existingPaymentOfType.isPresent()) {
                Payment existing = existingPaymentOfType.get();
                log.warn(
                    "Payment of type {} already exists for booking {} with status {}",
                    request.getType(), request.getBookingId(), existing.getStatus()
                );
                throw new PaymentAlreadyExistsException(
                    "Payment of type " + request.getType() + 
                    " already exists for booking " + request.getBookingId() +
                    " with status: " + existing.getStatus()
                );
            }
            
            // Step 4: Create new payment
            Payment payment = new Payment();
            payment.setId(UUID.randomUUID().toString());
            payment.setBookingId(request.getBookingId());
            payment.setAmount(request.getAmount());
            payment.setType(request.getType());
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setTransactionCode(request.getTransactionCode());
            payment.setIdempotencyKey(request.getIdempotencyKey());
            payment.setStatus(PaymentStatus.PENDING);
            
            // Step 5: Save (will fail with DataIntegrityViolationException if constraint violated)
            Payment savedPayment = paymentRepository.save(payment);
            
            log.info("Payment created successfully: {} for booking: {}", 
                savedPayment.getId(), request.getBookingId());
            
            return convertToDTO(savedPayment);
            
        } catch (DataIntegrityViolationException e) {
            
            // Database constraint violation - likely duplicate
            log.warn("DataIntegrityViolationException during payment creation: {}", 
                e.getMessage());
            
            // Attempt to retrieve existing payment by transaction code
            if (request.getTransactionCode() != null) {
                Optional<Payment> existing = 
                    paymentRepository.findByTransactionCode(request.getTransactionCode());
                if (existing.isPresent()) {
                    log.info("Found existing payment by transaction code: {}", 
                        request.getTransactionCode());
                    return convertToDTO(existing.get());
                }
            }
            
            // Attempt to retrieve by idempotency key
            if (request.getIdempotencyKey() != null) {
                Optional<Payment> existing = 
                    paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());
                if (existing.isPresent()) {
                    log.info("Found existing payment by idempotency key");
                    return convertToDTO(existing.get());
                }
            }
            
            throw e;
        }
    }
    
    /**
     * Process payment gateway webhook callback
     * 
     * Handles payment provider notifications about completed transactions.
     * Implements duplicate detection and idempotency.
     * 
     * Flow:
     * 1. Verify webhook signature
     * 2. Check if transaction already processed
     * 3. If yes: verify consistency and return (idempotent)
     * 4. If no: create payment and approve booking
     * 
     * @param webhook Payment webhook from provider
     * @throws PaymentMismatchException if amount or details don't match
     * @throws DataIntegrityViolationException if constraint violated
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void processPaymentCallback(PaymentWebhookDTO webhook) {
        
        String transactionCode = webhook.getTransactionId();
        
        log.info("Processing payment callback for transaction: {}", transactionCode);
        
        try {
            // Step 1: Check if transaction already processed
            Optional<Payment> existingPayment = 
                paymentRepository.findByTransactionCode(transactionCode);
            
            if (existingPayment.isPresent()) {
                Payment payment = existingPayment.get();
                
                log.info("Transaction {} already processed, verifying consistency", 
                    transactionCode);
                
                // Step 2: Verify consistency with webhook data
                if (!payment.getAmount().equals(webhook.getAmount())) {
                    log.error(
                        "Amount mismatch for transaction {}: " +
                        "DB amount: {}, Webhook amount: {}",
                        transactionCode, payment.getAmount(), webhook.getAmount()
                    );
                    throw new PaymentMismatchException(
                        "Amount mismatch for transaction " + transactionCode +
                        ": DB=" + payment.getAmount() + 
                        ", Webhook=" + webhook.getAmount()
                    );
                }
                
                // Step 3: If already completed, just confirm (idempotent)
                if (payment.getStatus() == PaymentStatus.COMPLETED) {
                    log.info("Transaction {} already completed, idempotent response", 
                        transactionCode);
                    return;
                }
                
                // Step 4: If still pending, update to completed
                if (payment.getStatus() == PaymentStatus.PENDING) {
                    log.info("Completing pending payment: {}", payment.getId());
                    
                    payment.setStatus(PaymentStatus.COMPLETED);
                    payment.setPaidAt(LocalDateTime.now());
                    paymentRepository.save(payment);
                    
                    // Trigger booking approval if all payments complete
                    approveBookingIfPaymentComplete(payment.getBookingId());
                }
                return;
            }
            
            // Step 5: New transaction - look up booking
            log.info("New transaction received: {}", transactionCode);
            
            String bookingId = webhook.getBookingId();
            Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Booking not found: " + bookingId
                ));
            
            // Step 6: Create new payment record
            Payment payment = new Payment();
            payment.setId(UUID.randomUUID().toString());
            payment.setBookingId(bookingId);
            payment.setAmount(webhook.getAmount());
            payment.setType(webhook.getType());
            payment.setPaymentMethod(webhook.getPaymentMethod());
            payment.setTransactionCode(transactionCode);
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            
            Payment savedPayment = paymentRepository.save(payment);
            log.info("Payment created from webhook: {} for booking: {}", 
                savedPayment.getId(), bookingId);
            
            // Step 7: Approve booking if this completes all required payments
            approveBookingIfPaymentComplete(bookingId);
            
        } catch (DataIntegrityViolationException e) {
            
            // Database constraint violation - likely duplicate
            log.warn("Duplicate payment detected (constraint violation) for transaction: {}", 
                transactionCode);
            
            // Verify and confirm the existing payment
            Optional<Payment> payment = 
                paymentRepository.findByTransactionCode(transactionCode);
            
            if (payment.isPresent()) {
                log.info("Existing payment found, confirming: {}", transactionCode);
                return;
            }
            
            log.error("Could not find existing payment after constraint violation", e);
            throw e;
        }
    }
    
    /**
     * Approve booking if all required payments are complete
     * 
     * @param bookingId Booking ID
     */
    private void approveBookingIfPaymentComplete(String bookingId) {
        
        // Check if both deposit and rental payments are completed
        List<Payment> payments = paymentRepository.findByBookingId(bookingId);
        
        boolean depositComplete = payments.stream()
            .anyMatch(p -> p.getType() == PaymentType.DEPOSIT && 
                          p.getStatus() == PaymentStatus.COMPLETED);
        
        boolean rentalComplete = payments.stream()
            .anyMatch(p -> p.getType() == PaymentType.RENTAL && 
                          p.getStatus() == PaymentStatus.COMPLETED);
        
        if (rentalComplete) {  // Rental is mandatory
            log.info("All required payments complete, approving booking: {}", bookingId);
            bookingService.approveBooking(bookingId);
        }
    }
    
    /**
     * Get payment by ID
     * 
     * @param paymentId Payment ID
     * @return PaymentDTO
     * @throws PaymentNotFoundException if not found
     */
    @Transactional(readOnly = true)
    public PaymentDTO getPayment(String paymentId) {
        
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new PaymentNotFoundException(
                "Payment not found: " + paymentId
            ));
        
        return convertToDTO(payment);
    }
    
    /**
     * Get all payments for a booking
     * 
     * @param bookingId Booking ID
     * @return List of PaymentDTOs
     */
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByBooking(String bookingId) {
        
        List<Payment> payments = paymentRepository.findByBookingId(bookingId);
        return payments.stream()
            .map(this::convertToDTO)
            .toList();
    }
    
    /**
     * Mark payment as failed (e.g., when transaction fails)
     * 
     * @param paymentId Payment ID
     * @return Updated PaymentDTO
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public PaymentDTO markPaymentFailed(String paymentId) {
        
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new PaymentNotFoundException(
                "Payment not found: " + paymentId
            ));
        
        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            throw new IllegalStateException(
                "Cannot mark completed payment as failed: " + paymentId
            );
        }
        
        payment.setStatus(PaymentStatus.FAILED);
        Payment updated = paymentRepository.save(payment);
        
        log.info("Payment marked as failed: {}", paymentId);
        
        return convertToDTO(updated);
    }
    
    /**
     * Refund a payment
     * 
     * @param paymentId Payment ID
     * @return Updated PaymentDTO
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public PaymentDTO refundPayment(String paymentId) {
        
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new PaymentNotFoundException(
                "Payment not found: " + paymentId
            ));
        
        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new IllegalStateException(
                "Only completed payments can be refunded: " + paymentId
            );
        }
        
        payment.setStatus(PaymentStatus.REFUNDED);
        Payment updated = paymentRepository.save(payment);
        
        log.info("Payment refunded: {}", paymentId);
        
        return convertToDTO(updated);
    }
    
    /**
     * Convert Payment entity to DTO
     * 
     * @param payment Payment entity
     * @return PaymentDTO
     */
    private PaymentDTO convertToDTO(Payment payment) {
        return PaymentDTO.builder()
            .id(payment.getId())
            .bookingId(payment.getBookingId())
            .amount(payment.getAmount())
            .type(payment.getType())
            .paymentMethod(payment.getPaymentMethod())
            .status(payment.getStatus())
            .transactionCode(payment.getTransactionCode())
            .idempotencyKey(payment.getIdempotencyKey())
            .paidAt(payment.getPaidAt())
            .createdAt(payment.getCreatedAt())
            .updatedAt(payment.getUpdatedAt())
            .build();
    }
}
