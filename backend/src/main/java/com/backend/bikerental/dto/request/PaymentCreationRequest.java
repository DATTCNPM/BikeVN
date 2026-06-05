package com.backend.bikerental.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCreationRequest {
    String bookingId;
    BigDecimal amount;
    String paymentMethod;
    String transactionCode;
    String idempotencyKey;
}
