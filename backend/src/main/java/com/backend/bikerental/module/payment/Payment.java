package com.backend.bikerental.module.payment;

import com.backend.bikerental.module.payment.enums.PaymentStatus;
import com.backend.bikerental.module.payment.enums.PaymentType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    String id;

    @Column(nullable = false, length = 36)
    String bookingId;

    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    PaymentType type;

    @Column(nullable = false, length = 50)
    String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    PaymentStatus status = PaymentStatus.pending;

    @Column(length = 100)
    String transactionCode;

    @Column(length = 100)
    String idempotencyKey;

    @Column(length = 36)
    String branchId;

    LocalDateTime paidAt;

    @Column(name = "notes", length = 255)
    String notes;

    @Column(updatable = false)
    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.status == null) {
            this.status = PaymentStatus.pending;
        }
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}

