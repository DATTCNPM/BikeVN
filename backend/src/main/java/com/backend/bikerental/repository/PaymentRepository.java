package com.backend.bikerental.repository;

import com.backend.bikerental.entity.Payment;
import com.backend.bikerental.enums.PaymentStatus;
import com.backend.bikerental.enums.PaymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByBookingId(String bookingId);
    List<Payment> findByBookingIdAndStatus(String bookingId, PaymentStatus status);
    List<Payment> findByBookingIdAndTypeAndStatus(
            String bookingId,
            PaymentType type,
            PaymentStatus status
    );
    List<Payment> findByStatus(PaymentStatus status);
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
    Optional<Payment> findByBranchId(String branchId);
    Optional<Payment> findFirstByBookingIdAndStatus(String bookingId, PaymentStatus status);
    Page<Payment> findByBookingIdIn(List<String> bookingIds, Pageable pageable);
    @Query("SELECT p FROM Payment p WHERE p.status = 'PENDING' ORDER BY p.createdAt DESC")
    List<Payment> findPendingPayments();
    long countByBookingIdAndStatus(String bookingId, PaymentStatus status);
    Page<Payment> findByBranchId(String branchId, Pageable pageable);
}
