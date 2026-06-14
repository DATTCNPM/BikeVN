package com.backend.bikerental.repository;

import com.backend.bikerental.entity.Review;
import com.backend.bikerental.entity.VehicleReturn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    boolean existsByBookingId(String bookingId);
    Page<Review> findByVehicleId(String vehicleId, Pageable pageable);
    Optional<Review> findByBookingId(String bookingId);
    @Query("SELECT r FROM Review r JOIN Booking b ON r.bookingId = b.id " +
            "WHERE b.pickupBranchId = :branchId")
    Page<Review> findByBranchId(@Param("branchId") String branchId, Pageable pageable);
}
