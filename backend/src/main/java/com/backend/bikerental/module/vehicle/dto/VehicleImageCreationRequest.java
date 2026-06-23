package com.backend.bikerental.module.vehicle.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleImageCreationRequest {
    String imageUrl;
    String altText;
    Integer displayOrder;
    Boolean isPrimary;
}