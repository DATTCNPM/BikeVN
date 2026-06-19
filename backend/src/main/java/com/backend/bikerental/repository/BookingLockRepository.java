package com.backend.bikerental.repository;

import com.backend.bikerental.entity.BookingLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
@Repository
public interface BookingLockRepository extends JpaRepository<BookingLock, String> {
    @Query("SELECT COUNT(l) > 0 FROM BookingLock l " +
            "WHERE l.vehicleId = :vehicleId " +
            "AND l.userId != :currentUserId " +
            "AND l.status = 'active' " +
            "AND l.lockExpiresAt > CURRENT_TIMESTAMP " +
            "AND (l.startTime < :endTime " +
            "AND l.endTime > :startTime)")
    boolean existsActiveLockByOthers(@Param("vehicleId") String vehicleId,
                             @Param("userId") String userId,
                             @Param("startTime") LocalDateTime startTime,
                             @Param("endTime")LocalDateTime endTime);

    @Query("SELECT l FROM BookingLock l " +
            "WHERE l.vehicleId = :vehicleId " +
            "AND l.userId = :userId " +
            "AND l.status = 'active' " +
            "AND l.lockExpiresAt > CURRENT_TIMESTAMP")
    Optional<BookingLock> findActiveLock(@Param("vehicleId") String vehicleId, @Param("userId") String userId);

}
