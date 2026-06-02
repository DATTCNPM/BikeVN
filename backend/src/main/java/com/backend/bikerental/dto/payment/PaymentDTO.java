package com.backend.bikerental.dto.payment;

import com.backend.bikerental.enumeration.PaymentStatus;
import com.backend.bikerental.enumeration.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment Data Transfer Object
 * 
 * Represents payment information returned to clients.
 * Contains all payment details including status and timestamps.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    
    private String id;
    
    private String bookingId;
    
    private BigDecimal amount;
    
    private PaymentType type;
    
    private String paymentMethod;
    
    private PaymentStatus status;
    
    private String transactionCode;
    
    private String idempotencyKey;
    
    private LocalDateTime paidAt;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
