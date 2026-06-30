package com.backend.bikerental.module.payment;

import com.backend.bikerental.module.payment.enums.PaymentStatus;
import com.backend.bikerental.module.payment.enums.PaymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String>, JpaSpecificationExecutor<Payment> {
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
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    BigDecimal calculateTotalRevenue(@Param("status") PaymentStatus status);

    @Query("SELECT MONTH(p.paidAt) as month, SUM(p.amount) as total " +
            "FROM Payment p " +
            "WHERE p.status = 'completed' AND YEAR(p.paidAt) = :year " +
            "GROUP BY MONTH(p.paidAt) " +
            "ORDER BY MONTH(p.paidAt)")
    List<Object[]> getMonthlyRevenue(@Param("year") int year);

    @Query("SELECT b.name, SUM(p.amount) " +
            "FROM Payment p JOIN Branch b ON p.branchId = b.id " +
            "WHERE p.status = 'completed' " +
            "GROUP BY b.id, b.name")
    List<Object[]> getRevenueByBranch();
}
