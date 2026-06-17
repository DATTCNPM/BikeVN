package com.backend.bikerental.specification;

import com.backend.bikerental.entity.Vehicle;
import com.backend.bikerental.enums.StatusVehicleEnum;
import com.backend.bikerental.enums.VehicleType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {
        public static Specification<Vehicle> filterVehicles(
                String name,
                StatusVehicleEnum status,
                VehicleType vehicleType,
                BigDecimal minPrice,
                BigDecimal maxPrice,
                String brandName,
                String modelName,
                String currentBranchName
        )
        {
            return((root, query, criteriaBuilder) -> {
                List<Predicate> predicates = new ArrayList<>();

                if(name != null && !name.isBlank())
                {
                    String searchPattern = "%" + name.toLowerCase() + "%";
                    predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern));
                }

                if (brandName != null && !brandName.isBlank()) {
                    String searchPattern = "%" + brandName.toLowerCase() + "%";
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("brand").get("name")), searchPattern));
                }

                if (modelName != null && !modelName.isBlank())
                {
                    String searchPattern = "%" + modelName.toLowerCase() + "%";
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("model").get("name")), searchPattern));
                }

                if(status != null)
                {
                    predicates.add(criteriaBuilder.equal(root.get("status"), status));
                }

                if(vehicleType != null)
                {
                    predicates.add(criteriaBuilder.equal(root.get("vehicleType"), vehicleType));
                }

                if(currentBranchName != null && !currentBranchName.isBlank())
                {
                    String searchPattern = "%" + currentBranchName.toLowerCase() + "%";
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("currentBranch").get("name")), searchPattern));
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
