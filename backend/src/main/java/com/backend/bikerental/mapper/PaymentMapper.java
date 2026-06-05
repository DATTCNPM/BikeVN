package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.PaymentCreationRequest;
import com.backend.bikerental.dto.response.PaymentResponse;
import com.backend.bikerental.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentResponse toPaymentResponse(Payment payment);
    Payment toPayment(PaymentCreationRequest request);
}
