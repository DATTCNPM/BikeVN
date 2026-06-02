package com.backend.bikerental.repository;

import com.backend.bikerental.entity.Payment;
import com.backend.bikerental.enumeration.PaymentStatus;
import com.backend.bikerental.enumeration.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Payment Repository
 * 
 * Data access layer for Payment entity with duplicate prevention support.
 * All queries are optimized for the composite indexes defined on the payments table.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    
    /**
     * Find payment by transaction code (from payment provider)
     * Used to prevent duplicate transactions from external callbacks
     * 
     * @param transactionCode External transaction code
     * @return Optional Payment
     */
    Optional<Payment> findByTransactionCode(String transactionCode);
    
    /**
     * Find payment by idempotency key (for request deduplication)
     * Used to handle duplicate API requests from clients
     * 
     * @param idempotencyKey Idempotency key from request header
     * @return Optional Payment
     */
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
    
    /**
     * Find payment of specific type for booking
     * Used to ensure only one payment of each type per booking
     * 
     * @param bookingId Booking ID
     * @param type Payment type (DEPOSIT or RENTAL)
     * @return Optional Payment
     */
    Optional<Payment> findByBookingIdAndType(String bookingId, PaymentType type);
    
    /**
     * Check if payment of specific type exists for booking
     * 
     * @param bookingId Booking ID
     * @param type Payment type
     * @return true if exists, false otherwise
     */
    boolean existsByBookingIdAndType(String bookingId, PaymentType type);
    
    /**
     * Find all payments for a booking
     * 
     * @param bookingId Booking ID
     * @return List of payments
     */
    List<Payment> findByBookingId(String bookingId);
    
    /**
     * Find all payments for booking with specific status
     * Uses composite index idx_booking_status_type
     * 
     * @param bookingId Booking ID
     * @param status Payment status
     * @return List of payments
     */
    List<Payment> findByBookingIdAndStatus(String bookingId, PaymentStatus status);
    
    /**
     * Find all payments for booking with specific type and status
     * Uses composite index idx_booking_status_type
     * 
     * @param bookingId Booking ID
     * @param type Payment type
     * @param status Payment status
     * @return List of payments
     */
    List<Payment> findByBookingIdAndTypeAndStatus(
        String bookingId, 
        PaymentType type, 
        PaymentStatus status
    );
    
    /**
     * Find all payments by status
     * 
     * @param status Payment status
     * @return List of payments
     */
    List<Payment> findByStatus(PaymentStatus status);
    
    /**
     * Find all payments by type
     * 
     * @param type Payment type
     * @return List of payments
     */
    List<Payment> findByType(PaymentType type);
    
    /**
     * Find all payments by payment method
     * 
     * @param paymentMethod Payment method (credit_card, cash, transfer, etc)
     * @return List of payments
     */
    List<Payment> findByPaymentMethod(String paymentMethod);
    
    /**
     * Find pending payments
     * Used for monitoring and cleanup of stuck transactions
     * 
     * @return List of pending payments
     */
    @Query("SELECT p FROM Payment p WHERE p.status = 'PENDING' ORDER BY p.createdAt DESC")
    List<Payment> findPendingPayments();
    
    /**
     * Find pending payments older than specified time
     * Used for cleanup of stuck transactions
     * 
     * @param dateTime Threshold datetime
     * @return List of old pending payments
     */
    @Query("SELECT p FROM Payment p WHERE p.status = 'PENDING' AND p.createdAt < :dateTime")
    List<Payment> findOldPendingPayments(@Param("dateTime") LocalDateTime dateTime);
    
    /**
     * Find payments created within a time range
     * Used for auditing and reconciliation
     * 
     * @param from Start datetime
     * @param to End datetime
     * @return List of payments
     */
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :from AND :to ORDER BY p.createdAt")
    List<Payment> findPaymentsInRange(
        @Param("from") LocalDateTime from, 
        @Param("to") LocalDateTime to
    );
    
    /**
     * Find payments completed within a time range
     * Used for revenue reporting
     * 
     * @param from Start datetime
     * @param to End datetime
     * @return List of completed payments
     */
    @Query("SELECT p FROM Payment p WHERE p.status = 'COMPLETED' AND p.paidAt BETWEEN :from AND :to ORDER BY p.paidAt")
    List<Payment> findCompletedPaymentsInRange(
        @Param("from") LocalDateTime from, 
        @Param("to") LocalDateTime to
    );
    
    /**
     * Find refunded payments within time range
     * 
     * @param from Start datetime
     * @param to End datetime
     * @return List of refunded payments
     */
    @Query("SELECT p FROM Payment p WHERE p.status = 'REFUNDED' AND p.updatedAt BETWEEN :from AND :to")
    List<Payment> findRefundedPaymentsInRange(
        @Param("from") LocalDateTime from, 
        @Param("to") LocalDateTime to
    );
    
    /**
     * Check if all required payments are completed for a booking
     * Returns true if at least one completed RENTAL payment exists
     * 
     * @param bookingId Booking ID
     * @return true if rental payment is completed
     */
    @Query("SELECT COUNT(p) > 0 FROM Payment p WHERE p.bookingId = :bookingId AND p.type = 'RENTAL' AND p.status = 'COMPLETED'")
    boolean isRentalPaymentCompleted(@Param("bookingId") String bookingId);
    
    /**
     * Count payments by status for a booking
     * 
     * @param bookingId Booking ID
     * @param status Payment status
     * @return Count of payments
     */
    int countByBookingIdAndStatus(String bookingId, PaymentStatus status);
    
    /**
     * Find payments with no transaction code (cash payments)
     * 
     * @return List of payments without transaction code
     */
    @Query("SELECT p FROM Payment p WHERE p.transactionCode IS NULL ORDER BY p.createdAt DESC")
    List<Payment> findPaymentsWithoutTransactionCode();
    
    /**
     * Find payments with no idempotency key (legacy payments)
     * 
     * @return List of payments without idempotency key
     */
    @Query("SELECT p FROM Payment p WHERE p.idempotencyKey IS NULL ORDER BY p.createdAt DESC")
    List<Payment> findPaymentsWithoutIdempotencyKey();
    
    /**
     * Find failed payments
     * 
     * @return List of failed payments
     */
    @Query("SELECT p FROM Payment p WHERE p.status = 'FAILED' ORDER BY p.createdAt DESC")
    List<Payment> findFailedPayments();
    
    /**
     * Find payments by booking and status
     * Uses composite index idx_booking_status_type
     * 
     * @param bookingId Booking ID
     * @param statuses Payment statuses
     * @return List of payments with specified statuses
     */
    @Query("SELECT p FROM Payment p WHERE p.bookingId = :bookingId AND p.status IN :statuses")
    List<Payment> findByBookingIdAndStatusIn(
        @Param("bookingId") String bookingId,
        @Param("statuses") List<PaymentStatus> statuses
    );
    
    /**
     * Get total amount paid for booking
     * 
     * @param bookingId Booking ID
     * @return Total amount (sum of completed payments)
     */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.bookingId = :bookingId AND p.status = 'COMPLETED'")
    java.math.BigDecimal getTotalPaidAmount(@Param("bookingId") String bookingId);
    
    /**
     * Get total refunded amount for booking
     * 
     * @param bookingId Booking ID
     * @return Total refunded amount
     */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.bookingId = :bookingId AND p.status = 'REFUNDED'")
    java.math.BigDecimal getTotalRefundedAmount(@Param("bookingId") String bookingId);
}
