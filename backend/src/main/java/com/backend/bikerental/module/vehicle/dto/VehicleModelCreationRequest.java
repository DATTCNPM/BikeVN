package com.backend.bikerental.module.vehicle.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleModelCreationRequest {
    Integer brandId;
    String name;
    Integer engineCapacity;
    Integer yearFrom;
    Integer yearTo;

}
