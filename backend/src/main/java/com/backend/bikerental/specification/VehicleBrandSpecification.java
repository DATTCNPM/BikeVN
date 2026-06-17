package com.backend.bikerental.specification;

import com.backend.bikerental.entity.VehicleBrand;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class VehicleBrandSpecification {
    public static Specification<VehicleBrand> filterVehicleBrands(
            String name,
            String country
    )
    {
        return ((root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            if(name != null && !name.isBlank())
            {
                String searchPattern = "%" + name.toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(root.get("name"), searchPattern));
            }

            if(country != null && !country.isBlank())
            {
                String searchPattern = "%" + country.toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(root.get("country"), searchPattern));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }
}
