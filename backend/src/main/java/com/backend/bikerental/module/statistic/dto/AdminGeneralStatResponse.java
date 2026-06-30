package com.backend.bikerental.module.statistic.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminGeneralStatResponse {
    BigDecimal totalRevenue;
    long totalBookings;
    long totalCustomers;
    long totalEmployees;
    long totalVehicles;
}
