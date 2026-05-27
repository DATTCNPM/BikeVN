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
    int brandId;
    int modelId;
    String licensePlate;
    String color;
    int year;
    BigDecimal pricePerDay;
    VehicleType vehicleType;
    int mileage;
    String description;
    StatusVehicleEnum status;
    String currentBranchId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
