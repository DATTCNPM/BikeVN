package com.backend.bikerental.entity;

import com.backend.bikerental.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    String id;
    @Column(nullable = false)
    String userId;
    @Column(nullable = false)
    String vehicleId;
    @Column(nullable = false)
    String pickupBranchId;
    @Column(nullable = false)
    String returnBranchId;
    @Column(nullable = false)
    LocalDateTime startTime;
    @Column(nullable = false)
    LocalDateTime endTime;
    LocalDateTime actualReturnTime;
    BigDecimal totalPrice;
    @Enumerated(value = EnumType.STRING)
    BookingStatus status;
    @Version
    int version;
    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;
    LocalDateTime expiresAt;
}
