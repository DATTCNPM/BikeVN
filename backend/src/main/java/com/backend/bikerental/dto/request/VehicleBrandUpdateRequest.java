package com.backend.bikerental.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleBrandUpdateRequest {
    String name;
    String country;
    LocalDateTime createdAt;
}
