package com.backend.bikerental.module.booking;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleReturnRepository extends
        JpaRepository<VehicleReturn, String>,
        JpaSpecificationExecutor<VehicleReturn> {
    Optional<VehicleReturn> findByBookingId(String bookingId);
    List<VehicleReturn> findByBookingIdIn(List<String> bookingIds);
    boolean existsByBookingId(String bookingId);
    Page<VehicleReturn> findByReturnBranchId(String returnBranchId, Pageable pageable);
}
