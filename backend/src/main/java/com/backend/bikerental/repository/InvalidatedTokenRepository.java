package com.backend.bikerental.repository;

import com.backend.bikerental.entity.InvalidateToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidateToken, String> {
}
