package com.backend.bikerental.module.review;

import com.backend.bikerental.module.review.dto.PublicReviewResponse;
import com.backend.bikerental.module.review.dto.ReviewRequest;
import com.backend.bikerental.module.review.dto.ReviewResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    Review toReview(ReviewRequest request);
    ReviewResponse toReviewResponse(Review review);
    PublicReviewResponse toPublicReviewResponse(Review review);
}
