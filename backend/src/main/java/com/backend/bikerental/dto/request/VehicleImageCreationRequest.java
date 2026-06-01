package com.backend.bikerental.dto.request;

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