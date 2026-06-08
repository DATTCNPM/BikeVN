package com.backend.bikerental.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleReturnRequest {
    String bookingId;
    String returnBranchId;
    String conditionStatus;
    String damageDescription;
    BigDecimal extraFee;
    List<MultipartFile> images;
    Integer returnOdometerReading;
    String notes;
    String employeeId;
}
