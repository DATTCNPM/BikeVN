package com.backend.bikerental.entity;

import com.backend.bikerental.enums.BookingLockEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking_locks")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingLock {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String vehicleId;
    String userId;
    LocalDateTime startTime;
    LocalDateTime endTime;
    LocalDateTime lockAcquiredAt;
    LocalDateTime lockExpiresAt;
    @Enumerated(EnumType.STRING)
    BookingLockEnum status;
    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;
}
