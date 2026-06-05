package com.backend.bikerental.dto.response;

import com.backend.bikerental.enums.PaymentStatus;
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
    BigDecimal amount;
    String type;
    String paymentMethod;
    PaymentStatus status;
    String bankName;
    String bankAccount;
    String accountName;
    String transferContent; ;
    String qrContent;
    LocalDateTime createdAt;
}
