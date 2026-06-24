package com.backend.bikerental.module.review;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ReviewSpecification {
        public static Specification<Review> filterReviews(
                String bookingId,
                String vehicleId,
                String userId,
                Integer rating
        )
        {
            return((root, query, criteriaBuilder) -> {
                List<Predicate> predicates = new ArrayList<>();

                if(bookingId != null && !bookingId.isBlank())
                {
                    String searchPattern = "%" + bookingId.toLowerCase() + "%";
                    predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("bookingId")), searchPattern));
                }

                if (vehicleId != null && !vehicleId.isBlank()) {
                    String searchPattern = "%" + vehicleId.toLowerCase() + "%";
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("vehicleId")), searchPattern));
                }

                if (userId != null && !userId.isBlank()) {
                    String searchPattern = "%" + userId.toLowerCase() + "%";
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("userId")), searchPattern));
                }

                if(rating != null)
                {
                    predicates.add(criteriaBuilder.equal(root.get("rating"), rating));
                }

                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            });
        }
}
