package com.backend.bikerental.module.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    //Get Customers
    Page<User> findByBranchIdIsNull(Pageable pageable);

    // Get Employees (Admin)
    Page<User> findByBranchIdIsNotNull(Pageable pageable);

    // 3. Get Employees (Employee only can see their teammates)
    Page<User> findByBranchId(String branchId, Pageable pageable);

    // Ném vào UserRepository.java
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = 'user'")
    long countCustomers();

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = 'employee'")
    long countEmployees();

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = 'employee' AND u.branch.id = :branchId")
    long countEmployeesByBranch(@Param("branchId") String branchId);
}
