package com.backend.bikerental.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
}
