package com.backend.bikerental.specification;

import com.backend.bikerental.entity.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> filterUsers(
            String keyword,     // search flexibility with name, email, phone in one textbox
            Boolean isActive,
            String branchId,
            String roleName
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                String searchPattern = "%" + keyword.toLowerCase() + "%";
                Predicate matchName = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern);
                Predicate matchEmail = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern);
                Predicate matchPhone = criteriaBuilder.like(root.get("phone"), searchPattern);

                predicates.add(criteriaBuilder.or(matchName, matchEmail, matchPhone));
            }

            if (isActive != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }

            if (branchId != null && !branchId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("branchId"), branchId));
            }

            if (roleName != null && !roleName.isBlank()) {
                Join<Object, Object> rolesJoin = root.join("roles");
                predicates.add(criteriaBuilder.equal(rolesJoin.get("name"), roleName));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}