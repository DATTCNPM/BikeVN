package com.backend.bikerental.repository;

import com.backend.bikerental.entity.VehicleReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleReturnRepository extends JpaRepository<VehicleReturn, String> {
    Optional<VehicleReturn> findByBookingId(String bookingId);
    boolean existsByBookingId(String bookingId);
}
