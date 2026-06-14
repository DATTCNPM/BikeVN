package com.backend.bikerental.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(length = 36, nullable = false, unique = true)
    String bookingId;
    @Column(length = 36, nullable = false)
    String userId;
    @Column(length = 36, nullable = false)
    String vehicleId;
    @Column(nullable = false)
    int rating;
    @Column(columnDefinition = "TEXT")
    String comment;
    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
}
