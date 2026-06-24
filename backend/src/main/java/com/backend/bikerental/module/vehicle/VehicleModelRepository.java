package com.backend.bikerental.module.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleModelRepository extends
        JpaRepository<VehicleModel, Integer>, JpaSpecificationExecutor<VehicleModel> {
    Optional<VehicleModel> findByName(String name);
    boolean existsByName(String name);
}
