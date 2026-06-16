package com.backend.bikerental.repository;

import com.backend.bikerental.entity.VehicleReturn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleReturnRepository extends
        JpaRepository<VehicleReturn, String>,
        JpaSpecificationExecutor<VehicleReturn> {
    Optional<VehicleReturn> findByBookingId(String bookingId);
    boolean existsByBookingId(String bookingId);
    Page<VehicleReturn> findByReturnBranchId(String returnBranchId, Pageable pageable);
}
