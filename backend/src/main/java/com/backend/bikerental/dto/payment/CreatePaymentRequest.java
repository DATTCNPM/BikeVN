package com.backend.bikerental.dto.payment;

import com.backend.bikerental.enumeration.PaymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Create Payment Request DTO
 * 
 * Used for payment creation requests from clients.
 * Includes idempotency_key for duplicate request prevention.
 * 
 * Example:
 * {
 *   "bookingId": "booking-123",
 *   "amount": 1500000,
 *   "type": "RENTAL",
 *   "paymentMethod": "credit_card",
 *   "transactionCode": "TXN001",
 *   "idempotencyKey": "IDEM-20240115-001"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePaymentRequest {
    
    /**
     * Booking ID (foreign key)
     */
    @NotBlank(message = "Booking ID is required")
    private String bookingId;
    
    /**
     * Payment amount in VND
     */
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    /**
     * Payment type: DEPOSIT or RENTAL
     * Only one of each type allowed per booking
     */
    @NotNull(message = "Payment type is required")
    private PaymentType type;
    
    /**
     * Payment method: credit_card, cash, transfer, bank_transfer, etc
     */
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
    
    /**
     * External transaction code from payment provider
     * Must be unique across all payments (database constraint)
     * Optional for cash payments
     */
    private String transactionCode;
    
    /**
     * Idempotency key for duplicate request prevention
     * Recommended: UUID or timestamp-based unique key
     * Required for non-cash payments
     * 
     * Database constraint ensures each idempotency_key is unique
     */
    private String idempotencyKey;
}
