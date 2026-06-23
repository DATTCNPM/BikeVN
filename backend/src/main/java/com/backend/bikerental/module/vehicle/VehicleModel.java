package com.backend.bikerental.module.vehicle;

import com.backend.bikerental.module.vehicle.VehicleBrand;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_models")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    VehicleBrand brand;
    @Column(nullable = false)
    String name;
    @Column(nullable = false)
    int engineCapacity;
    Integer yearFrom;
    Integer yearTo;
    @CreationTimestamp
    @Column(nullable = false)
    LocalDateTime createdAt;
}
