package com.backend.bikerental.module.branch.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BranchCreationRequest {
    String name;
    String address;
    BigDecimal lat;
    BigDecimal lng;
    String status;
}
