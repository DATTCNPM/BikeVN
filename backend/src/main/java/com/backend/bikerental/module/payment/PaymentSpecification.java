package com.backend.bikerental.module.payment;

import com.backend.bikerental.module.payment.enums.PaymentStatus;
import com.backend.bikerental.module.payment.enums.PaymentType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class PaymentSpecification {

    public static Specification<Payment> filterPayments(
            String bookingId,
            String transactionCode,
            String branchId,
            PaymentStatus status,
            PaymentType type,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (bookingId != null && !bookingId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("bookingId"), bookingId));
            }

            if (transactionCode != null && !transactionCode.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("transactionCode"), transactionCode));
            }

            if (branchId != null && !branchId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("branchId"), branchId));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
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