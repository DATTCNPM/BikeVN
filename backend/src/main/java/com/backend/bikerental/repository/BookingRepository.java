package com.backend.bikerental.repository;

import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {
    //p1 query
    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
            "WHERE b.vehicleId = :vehicleId " +
            "AND b.status IN ('PENDING', 'CONFIRMED') " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsConflict(
            @Param("vehicleId") String vehicleId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
    //p2 jpa hibernate
    boolean existsByVehicleIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            String vehicleId,
            List<BookingStatus> statuses,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
}
