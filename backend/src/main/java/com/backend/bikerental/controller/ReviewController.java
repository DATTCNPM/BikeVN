package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.ReviewRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.ReviewResponse;
import com.backend.bikerental.service.ReviewService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {
    ReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(@RequestBody @Valid ReviewRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.createReview(request))
                .build();
    }

    @GetMapping("/vehicles/{vehicleId}")
    public ApiResponse<PageResponse<ReviewResponse>> getReviewsByVehicle(
            @PathVariable String vehicleId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<ReviewResponse>>builder()
                .result(reviewService.getReviewsByVehicle(vehicleId, page, size))
                .build();
    }

    @GetMapping("/branches/{branchId}")
    public ApiResponse<PageResponse<ReviewResponse>> getReviewsByBranch(
            @PathVariable String branchId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<ReviewResponse>>builder()
                .result(reviewService.getReviewsByBranch(branchId, page, size))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ApiResponse.<Void>builder()
                .message("Review deleted successfully")
                .build();
    }
}
