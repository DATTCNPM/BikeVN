package com.backend.bikerental.entity;

import com.backend.bikerental.enums.StatusVehicleEnum;
import com.backend.bikerental.enums.VehicleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.NonFinal;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    String id;
    String name;
    @ManyToOne
    @Column(name = "brand_id", nullable = false)
    VehicleBrand brandId;
    @ManyToOne
    @Column(name = "model_id", nullable = false)
    int modelId;
    @Column(length = 20, name = "license_plate")
    String licensePlate;
    String color;
    int year;
    @Column(name = "price_per_day", precision = 10, scale = 2)
    BigDecimal pricePerDay;
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type")
    VehicleType vehicleType;
    int mileage;
    String description;
    @Enumerated(EnumType.STRING)
    StatusVehicleEnum status;
    @ManyToOne
    @Column(name = "current_branch_id", nullable = false, length = 36)
    String currentBranchId;
    @CreationTimestamp
    @Column(nullable = false)
    LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(nullable = false)
    LocalDateTime updatedAt;
}
