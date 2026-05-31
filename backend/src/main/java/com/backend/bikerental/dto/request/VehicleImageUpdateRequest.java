package com.backend.bikerental.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleImageUpdateRequest {
    private String imageUrl;
    private String altText;
    private Integer displayOrder;
    private Boolean isPrimary;
}