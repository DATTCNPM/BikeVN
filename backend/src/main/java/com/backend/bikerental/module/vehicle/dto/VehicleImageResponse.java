package com.backend.bikerental.module.vehicle.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleImageResponse {
    String id;
    String vehicleId;
    String imageUrl;
    String altText;
    Integer displayOrder;
    Boolean isPrimary;
    LocalDateTime createdAt;
}