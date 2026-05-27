package com.backend.bikerental.entity;

import com.backend.bikerental.enums.BranchStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "branches")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String address;
    @Column(precision = 10, scale = 8)
    BigDecimal lat;
    @Column(precision = 11, scale = 8)
    BigDecimal lng;
    @Enumerated(EnumType.STRING)
    BranchStatus status;
    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;

}
