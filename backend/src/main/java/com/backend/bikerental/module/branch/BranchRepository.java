package com.backend.bikerental.module.branch;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, String> {
    boolean existsByName(String name);
    Optional<Branch> findByName(String name);
}
