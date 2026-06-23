package com.backend.bikerental.module.vehicle;

import com.backend.bikerental.module.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    Vehicle vehicle;

    @Column(name = "image_url", nullable = false, length = 500)
    String imageUrl;

    @Column(name = "alt_text", length = 255)
    String altText;

    @Column(name = "display_order")
    Integer displayOrder = 0;

    @Column(name = "is_primary")
    Boolean isPrimary = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (displayOrder == null) {
            displayOrder = 0;
        }
        if (isPrimary == null) {
            isPrimary = false;
        }
    }
}