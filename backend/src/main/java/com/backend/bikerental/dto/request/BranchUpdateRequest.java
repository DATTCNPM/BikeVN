package com.backend.bikerental.dto.request;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BranchUpdateRequest {
    String name;
    String address;
    BigDecimal lat;
    BigDecimal lng;
    String status;
}
