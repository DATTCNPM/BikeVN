package com.backend.bikerental.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleUpdateRequest {
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
}
