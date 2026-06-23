package com.backend.bikerental.module.booking.dto;

import com.backend.bikerental.module.payment.dto.PaymentResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleReturnResponse {
    String id;
    String bookingId;
    String returnBranchId;
    String conditionStatus;
    String damageDescription;
    BigDecimal extraFee;
    List<String> images;
    Integer returnOdometerReading;
    String notes;
    String employeeId;
    PaymentResponse payment;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
