package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.ReviewRequest;
import com.backend.bikerental.dto.response.PublicReviewResponse;
import com.backend.bikerental.dto.response.ReviewResponse;
import com.backend.bikerental.entity.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    Review toReview(ReviewRequest request);
    ReviewResponse toReviewResponse(Review review);
    PublicReviewResponse toPublicReviewResponse(Review review);
}
