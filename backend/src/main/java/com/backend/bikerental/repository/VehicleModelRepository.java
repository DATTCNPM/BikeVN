package com.backend.bikerental.repository;

import com.backend.bikerental.entity.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleModelRepository extends JpaRepository<VehicleModel, Integer> {
    Optional<VehicleModel> findByName(String name);
}
