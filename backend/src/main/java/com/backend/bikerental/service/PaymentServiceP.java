package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.PaymentCreationRequest;
import com.backend.bikerental.dto.response.PaymentResponse;
import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.entity.Payment;
import com.backend.bikerental.enums.BookingStatus;
import com.backend.bikerental.enums.PaymentStatus;
import com.backend.bikerental.enums.PaymentType;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.repository.BookingRepository;
import com.backend.bikerental.repository.PaymentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentServiceP {

    PaymentRepository paymentRepository;
    BookingRepository bookingRepository;
    BookingService bookingService;
    static final String BANK_NAME = "MB Bank";
    static final String BANK_ACCOUNT = "1223445";
    static final String ACCOUNT_NAME = "Tran Hoang Phuong";

    static final int EXPIRE_MINUTES = 15;
    @Transactional
    public PaymentResponse createPayment(PaymentCreationRequest request) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (booking.getStatus() == BookingStatus.completed) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_COMPLETED);
        }

        // idempotency
        paymentRepository.findByIdempotencyKey(request.getIdempotencyKey())
                .ifPresent(p -> {
                    throw new AppException(ErrorCode.DUPLICATE_PAYMENT);
                });

        // nếu đã có pending → reuse
        Optional<Payment> existing = paymentRepository
                .findFirstByBookingIdAndStatus(request.getBookingId(), PaymentStatus.pending);

        if (existing.isPresent()) {
            return buildResponse(existing.get(), booking);
        }

        // check conflict lại trước khi cho thanh toán
        if (bookingService.isTimeConflict(booking)) {
            throw new AppException(ErrorCode.BOOKING_TIME_CONFLICT);
        }

        Payment payment = new Payment();
        LocalDateTime now = LocalDateTime.now();

        payment.setBookingId(booking.getId());
        payment.setAmount(booking.getTotalPrice());
        payment.setStatus(PaymentStatus.pending);
        payment.setPaymentMethod("bank_transfer");
        payment.setIdempotencyKey(request.getIdempotencyKey());
        payment.setType(PaymentType.deposit);
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);

        System.out.println(payment.getType());
        System.out.println(PaymentType.deposit);

        paymentRepository.save(payment);
        System.out.println("DB TYPE = " + payment.getType());

        return buildResponse(payment, booking);
    }
    @Transactional
    public void confirmPayment(String paymentId, String transactionCode) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getStatus() == PaymentStatus.completed) {
            return; // idempotent
        }

        // check expire
        if (isExpired(payment)) {
            payment.setStatus(PaymentStatus.failed);
            paymentRepository.save(payment);
            throw new AppException(ErrorCode.PAYMENT_EXPIRED);
        }

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (bookingService.isTimeConflict(booking)) {
            payment.setStatus(PaymentStatus.failed);
            paymentRepository.save(payment);
            throw new AppException(ErrorCode.BOOKING_TIME_CONFLICT);
        }

        // SUCCESS
        payment.setStatus(PaymentStatus.completed);
        payment.setTransactionCode(transactionCode);
        payment.setPaidAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        booking.setStatus(BookingStatus.approved);

        paymentRepository.save(payment);
        bookingRepository.save(booking);
    }
    @Transactional
    public void expirePayments() {
        List<Payment> payments = paymentRepository.findByStatus(PaymentStatus.pending);

        LocalDateTime now = LocalDateTime.now();

        for (Payment p : payments) {
            if (p.getCreatedAt().isBefore(now.minusMinutes(EXPIRE_MINUTES))) {
                p.setStatus(PaymentStatus.failed);
                p.setUpdatedAt(now);
            }
        }

        paymentRepository.saveAll(payments);
    }
    public PaymentResponse getPayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        return buildResponse(payment, booking);
    }
    private boolean isExpired(Payment payment) {
        return payment.getCreatedAt()
                .isBefore(LocalDateTime.now().minusMinutes(EXPIRE_MINUTES));
    }

    private PaymentResponse buildResponse(Payment payment, Booking booking) {

        String content = "BOOKING " + booking.getId();

        String qrContent = "BANK:" + BANK_NAME
                + "|ACC:" + BANK_ACCOUNT
                + "|AMOUNT:" + booking.getTotalPrice()
                + "|INFO:" + content;

        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(booking.getId())
                .amount(payment.getAmount())
                .type(payment.getType().name())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())

                .bankName(BANK_NAME)
                .bankAccount(BANK_ACCOUNT)
                .accountName(ACCOUNT_NAME)
                .transferContent(content)
                .qrContent(qrContent)

                .createdAt(payment.getCreatedAt())
                .build();
    }
}

