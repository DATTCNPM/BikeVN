package com.backend.bikerental.module.payment;

import com.backend.bikerental.module.payment.dto.PaymentCreationRequest;
import com.backend.bikerental.module.payment.dto.PaymentResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentResponse toPaymentResponse(Payment payment);
    Payment toPayment(PaymentCreationRequest request);
}
