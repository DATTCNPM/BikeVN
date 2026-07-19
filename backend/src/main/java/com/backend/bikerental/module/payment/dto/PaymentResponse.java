package com.backend.bikerental.module.payment.dto;

import com.backend.bikerental.module.payment.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    String id;
    String bookingId;
    String branchId;
    BigDecimal amount;
    String type;
    String paymentMethod;
    PaymentStatus status;
    LocalDateTime paidAt;
    String transactionCode;
    String transferContent;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
