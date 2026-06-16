package com.backend.bikerental.specification;

import com.backend.bikerental.entity.VehicleReturn;
import com.backend.bikerental.enums.VehicleConditionStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class VehicleReturnSpecification {
    public static Specification<VehicleReturn> filterVehicleReturns(
            String bookingId,
            String returnBranchId,
            VehicleConditionStatus conditionStatus,
            LocalDate fromDate,
            LocalDate toDate
    )
    {
        return((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (bookingId != null && !bookingId.isBlank())
            {
                predicates.add(criteriaBuilder.equal(root.get("bookingId"), bookingId));
            }

            if (returnBranchId != null && !returnBranchId.isBlank())
            {
                predicates.add(criteriaBuilder.equal(root.get("returnBranchId"), returnBranchId));
            }

            if(conditionStatus != null)
            {
                predicates.add(criteriaBuilder.equal(root.get("conditionStatus"), conditionStatus));
            }

            if(fromDate != null)
            {
                LocalDateTime startOfDay = fromDate.atStartOfDay();
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startOfDay));
            }

            if (toDate != null)
            {
                LocalDateTime endOfDay = toDate.atTime(23, 59, 59, 999999999);
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endOfDay));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }
}
