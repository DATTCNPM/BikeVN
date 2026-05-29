package com.backend.bikerental.dto.request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchUpdateRequest {
    String name;
    String address;
    BigDecimal lat;
    BigDecimal lng;
    String status;
}
