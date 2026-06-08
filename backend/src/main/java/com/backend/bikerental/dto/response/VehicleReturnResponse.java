package com.backend.bikerental.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleReturnResponse {
    String id;
    String bookingId;
    String returnBranchId;
    String conditionStatus;
    String damageDescription;
    BigDecimal extraFee;
    List<String> images;
    Integer returnOdometerReading;
    String notes;
    String employeeId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
