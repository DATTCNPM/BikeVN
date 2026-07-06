package com.backend.bikerental.module.booking.dto;

import com.backend.bikerental.module.payment.dto.PaymentResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {
    String id;
    String userId;
    String vehicleId;
    String pickupBranchId;
    String returnBranchId;
    LocalDateTime startTime;
    LocalDateTime endTime;
    LocalDateTime actualReturnTime;
    BigDecimal totalPrice;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<PaymentResponse> payments;
    VehicleReturnResponse vehicleReturn;
}

