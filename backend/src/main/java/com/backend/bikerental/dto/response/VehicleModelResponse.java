package com.backend.bikerental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleModelResponse {
        private int id;
        private Integer brandId;
        private String name;
        private Integer engineCapacity;
        private Integer yearFrom;
        private Integer yearTo;
        private LocalDateTime createdAt;
}
