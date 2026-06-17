package com.backend.bikerental.repository;

import com.backend.bikerental.entity.VehicleBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleBrandRepository extends
        JpaRepository<VehicleBrand, Integer>, JpaSpecificationExecutor<VehicleBrand> {
    Optional<VehicleBrand> findByName(String name);
    boolean existsByName(String name);
}
