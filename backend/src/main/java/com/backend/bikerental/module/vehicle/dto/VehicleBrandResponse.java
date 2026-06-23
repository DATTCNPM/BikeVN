package com.backend.bikerental.module.vehicle.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleBrandResponse {
    int id;
    String name;
    String country;
    LocalDateTime createdAt;
}
