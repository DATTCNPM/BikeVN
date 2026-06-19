package com.backend.bikerental.specification;

import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.enums.BookingStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class BookingSpecification {

    public static Specification<Booking> filterBookings(
            String userId,
            String vehicleId,
            String branchId, // Dùng chung cho cả pickup và return (Phân quyền)
            BookingStatus status,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (userId != null && !userId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("userId"), userId));
            }

            if (vehicleId != null && !vehicleId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("vehicleId"), vehicleId));
            }

            if (branchId != null && !branchId.isBlank()) {
                Predicate isPickupBranch = criteriaBuilder.equal(root.get("pickupBranchId"), branchId);
                Predicate isReturnBranch = criteriaBuilder.equal(root.get("returnBranchId"), branchId);
                predicates.add(criteriaBuilder.or(isPickupBranch, isReturnBranch));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (fromDate != null) {
                LocalDateTime startOfDay = fromDate.atStartOfDay();
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startOfDay));
            }

            if (toDate != null) {
                LocalDateTime endOfDay = toDate.atTime(LocalTime.MAX);
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endOfDay));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}