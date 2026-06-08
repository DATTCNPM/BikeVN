package com.backend.bikerental.repository;

import com.backend.bikerental.entity.InvalidateToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidateToken, String> {
}
