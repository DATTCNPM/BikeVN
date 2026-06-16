package com.backend.bikerental.specification;

import com.backend.bikerental.entity.Vehicle;
import com.backend.bikerental.enums.StatusVehicleEnum;
import com.backend.bikerental.enums.VehicleConditionStatus;
import com.backend.bikerental.enums.VehicleType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {
    public static Specification<Vehicle> filterVehicles(
            Integer brandId,
            Integer modelId,
            StatusVehicleEnum status,
            VehicleType vehicleType,
            String currentBranchId,
            BigDecimal minPrice,
            BigDecimal maxPrice
    )
    {
        return((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (brandId != null) {
                predicates.add(criteriaBuilder.equal(root.get("brand").get("id"), brandId));
            }

            if (modelId != null)
            {
                predicates.add(criteriaBuilder.equal(root.get("model").get("id"), modelId));
            }

            if(status != null)
            {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if(vehicleType != null)
            {
                predicates.add(criteriaBuilder.equal(root.get("vehicleType"), vehicleType));
            }

            if(currentBranchId != null && !currentBranchId.isBlank())
            {
                predicates.add(criteriaBuilder.equal(root.get("currentBranch").get("id"), currentBranchId));
            }

            if(minPrice != null)
            {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("pricePerDay"), minPrice));
            }

            if(maxPrice != null)
            {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("pricePerDay"), maxPrice));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }
}
