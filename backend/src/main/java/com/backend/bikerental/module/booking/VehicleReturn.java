package com.backend.bikerental.module.booking;

import com.backend.bikerental.module.vehicle.enums.VehicleConditionStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vehicle_returns")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleReturn {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    String id;
    @Column(length = 36, nullable = false, unique = true)
    String bookingId;
    @Column(length = 36, nullable = false)
    String returnBranchId;
    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    VehicleConditionStatus conditionStatus;
    @Column(columnDefinition = "TEXT")
    String damageDescription;
    @Column(precision = 10, scale = 2)
    BigDecimal extraFee;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    List<String> images;
    Integer returnOdometerReading;
    @Column(columnDefinition = "TEXT")
    String notes;
    @Column(length = 36, nullable = false)
    String employeeId;
    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;
}
