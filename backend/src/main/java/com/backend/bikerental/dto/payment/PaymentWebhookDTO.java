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
 * Payment Webhook DTO
 * 
 * Represents incoming webhook callback from payment provider.
 * Used for server-to-server payment status notifications.
 * 
 * All webhooks must be verified with provider signature before processing.
 * 
 * Example webhook from payment provider:
 * {
 *   "transactionId": "TXN001",
 *   "bookingId": "booking-123",
 *   "amount": 1500000,
 *   "type": "RENTAL",
 *   "paymentMethod": "credit_card",
 *   "status": "SUCCESS",
 *   "timestamp": "2024-01-15T18:30:00Z"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentWebhookDTO {
    
    /**
     * Unique transaction ID from payment provider
     * Used to identify and deduplicate transactions
     */
    @NotBlank(message = "Transaction ID is required")
    private String transactionId;
    
    /**
     * Booking ID associated with this payment
     */
    @NotBlank(message = "Booking ID is required")
    private String bookingId;
    
    /**
     * Payment amount in VND
     * Must match the amount in payment request
     */
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    /**
     * Payment type: DEPOSIT or RENTAL
     */
    @NotNull(message = "Payment type is required")
    private PaymentType type;
    
    /**
     * Payment method used
     */
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
    
    /**
     * Transaction status: SUCCESS, PENDING, FAILED
     */
    @NotBlank(message = "Status is required")
    private String status;
    
    /**
     * Timestamp from provider
     */
    private String timestamp;
    
    /**
     * Optional: Reference or description
     */
    private String reference;
}
