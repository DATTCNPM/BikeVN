package com.backend.bikerental.module.vehicle.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleResponse {
    String id;
    String name;
    Integer brandId;
    Integer modelId;
    String licensePlate;
    String color;
    Integer year;
    BigDecimal pricePerDay;
    String vehicleType;
    Integer mileage;
    String description;
    String status;
    String currentBranchId;
    List<VehicleImageResponse> images;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    //
    String brandName;
    String modelName;
    String currentBranchName;
    String country;
}
