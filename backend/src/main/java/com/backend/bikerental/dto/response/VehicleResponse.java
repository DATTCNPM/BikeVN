package com.backend.bikerental.dto.response;

import com.backend.bikerental.enums.StatusVehicleEnum;
import com.backend.bikerental.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
//    LocalDateTime createdAt;
//    LocalDateTime updatedAt;
}
