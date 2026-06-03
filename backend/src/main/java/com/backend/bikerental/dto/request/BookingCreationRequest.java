package com.backend.bikerental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingCreationRequest {
    @NotBlank
    String userId;
    @NotBlank
    String vehicleId;
    @NotBlank
    String pickupBranchId;
    @NotBlank
    String returnBranchId;
    @NotNull
    LocalDateTime startTime;
    @NotNull
    LocalDateTime endTime;
}
