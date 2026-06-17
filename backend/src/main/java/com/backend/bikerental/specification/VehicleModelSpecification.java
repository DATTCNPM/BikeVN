package com.backend.bikerental.specification;

import com.backend.bikerental.entity.VehicleModel;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class VehicleModelSpecification {
    public static Specification<VehicleModel> filterVehicleModels(
            Integer brandId,
            String name,
            Integer minEngineCapacity,
            Integer maxEngineCapacity,
            Integer productionYear
    )
    {
        return ((root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            if(brandId != null)
            {
                predicates.add(criteriaBuilder.equal(root.get("brand").get("id"), brandId));
            }

            if(name != null && !name.isBlank())
            {
                String searchPattern = "%" + name.toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(root.get("name"), searchPattern));
            }

            if (minEngineCapacity != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("engineCapacity"), minEngineCapacity));
            }

            if (maxEngineCapacity != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("engineCapacity"), maxEngineCapacity));
            }

            if(productionYear != null)
            {
                Predicate yearFromValid = criteriaBuilder.lessThanOrEqualTo(root.get("yearFrom"), productionYear);

                Predicate yearToIsNull = criteriaBuilder.isNull(root.get("yearTo"));
                Predicate yearToValid = criteriaBuilder.greaterThanOrEqualTo(root.get("yearTo"), productionYear);
                Predicate yearToCondition = criteriaBuilder.or(yearToIsNull, yearToValid); // Gom OR

                predicates.add(criteriaBuilder.and(yearFromValid, yearToCondition));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }
}
