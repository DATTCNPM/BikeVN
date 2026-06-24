package com.backend.bikerental.module.vehicle;

import com.backend.bikerental.module.vehicle.enums.StatusVehicleEnum;
import com.backend.bikerental.module.vehicle.enums.VehicleType;
import com.backend.bikerental.module.branch.Branch;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    String id;
    String name;
    
    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    VehicleBrand brand;
    
    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    VehicleModel model;
    
    @Column(length = 20, name = "license_plate")
    String licensePlate;
    String color;
    Integer year;
    @Column(name = "price_per_day", precision = 10, scale = 2)
    BigDecimal pricePerDay;
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type")
    VehicleType vehicleType;
    Integer mileage;
    String description;
    @Enumerated(EnumType.STRING)
    StatusVehicleEnum status;
    
    @ManyToOne
    @JoinColumn(name = "current_branch_id", nullable = false)
    Branch currentBranch;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, createdAt ASC")
    List<VehicleImage> images = new ArrayList<>();
    
    @CreationTimestamp
    @Column(nullable = false)
    LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(nullable = false)
    LocalDateTime updatedAt;
}
