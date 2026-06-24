package com.backend.bikerental.module.vehicle.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleModelResponse {
    int id;
    Integer brandId;
    String name;
    Integer engineCapacity;
    Integer yearFrom;
    Integer yearTo;
    LocalDateTime createdAt;
}
