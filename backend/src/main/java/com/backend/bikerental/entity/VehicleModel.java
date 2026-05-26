package com.backend.bikerental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_models")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    int yearFrom;
    int yearTo;
    @CreationTimestamp
    @Column(nullable = false)
    LocalDateTime createdAt;
}
