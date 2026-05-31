package com.backend.bikerental.repository;

import com.backend.bikerental.entity.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleImageRepository extends JpaRepository<VehicleImage, String> {
    List<VehicleImage> findByVehicle_IdOrderByDisplayOrderAsc(String vehicleId);
    Optional<VehicleImage> findByIdAndVehicle_Id(String id, String vehicleId);
    long countByVehicle_IdAndIsPrimaryTrue(String vehicleId);
}