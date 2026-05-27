package com.backend.bikerental.repository;

import com.backend.bikerental.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, String> {
    Optional<Branch> findByName(String name);
}
