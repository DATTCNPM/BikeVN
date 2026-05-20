package com.backend.bikerental.repository;

import com.backend.bikerental.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
}
