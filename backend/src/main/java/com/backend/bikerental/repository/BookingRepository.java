package com.backend.bikerental.repository;

import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    //p1 query
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END\n" +
            "FROM Booking b\n" +
            "WHERE b.vehicleId = :vehicleId\n" +
            "AND b.id != :bookingId\n" +
            "AND b.status IN ('pending', 'approved')\n" +
            "AND (b.expiresAt IS NULL OR b.expiresAt > :now)\n" +
            "AND b.startTime < :endTime\n" +
            "AND b.endTime > :startTime")
    boolean existsConflict(
            String vehicleId,
            String bookingId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            LocalDateTime now
    );
    //p2 jpa hibernate
    boolean existsByVehicleIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            String vehicleId,
            List<BookingStatus> statuses,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    @Query(
            "SELECT COUNT(b) > 0 FROM Booking b " +
                    "WHERE b.vehicleId = :vehicleId " +
                    "AND b.status IN ('approved', 'completed') " +
                    "AND (b.startTime < :endTime AND b.endTime > :startTime)"
    )
    boolean existsApprovedBooking(@Param("vehicleId") String vehicleId,
                                  @Param("startTime") LocalDateTime startTime,
                                  @Param("endTime") LocalDateTime endTime);

    Optional<Booking> findFirstByUserIdAndStatus(
            String userId,
            BookingStatus status
    );
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByUserId(String userId);
    List<Booking> findByStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime time);
    List<String> findIdsByPickupBranchId(String branchId);
}
