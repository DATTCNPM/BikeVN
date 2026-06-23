package com.backend.bikerental.module.branch.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchResponse {
    String id;
    String name;
    String address;
    BigDecimal lat;
    BigDecimal lng;
    String status;
}
