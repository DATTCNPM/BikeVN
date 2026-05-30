package com.backend.bikerental.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleModelUpdateRequest {
    Integer brandId;
    String name;
    Integer engineCapacity;
    Integer yearFrom;
    Integer yearTo;

}
