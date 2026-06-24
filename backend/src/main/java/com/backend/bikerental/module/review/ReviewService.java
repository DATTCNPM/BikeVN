package com.backend.bikerental.module.review;

import com.backend.bikerental.core.dto.PageResponse;
import com.backend.bikerental.module.booking.Booking;
import com.backend.bikerental.module.review.dto.PublicReviewResponse;
import com.backend.bikerental.module.review.dto.ReviewRequest;
import com.backend.bikerental.module.review.dto.ReviewResponse;
import com.backend.bikerental.module.user.User;
import com.backend.bikerental.module.booking.enums.BookingStatus;
import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.backend.bikerental.module.booking.BookingRepository;
import com.backend.bikerental.module.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {
    ReviewRepository reviewRepository;
    BookingRepository bookingRepository;
    UserRepository userRepository;
    ReviewMapper reviewMapper;
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public ReviewResponse createReview(ReviewRequest request)
    {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(()-> new AppException(ErrorCode.BRAND_NOT_EXISTED));

        if(booking.getStatus() != BookingStatus.completed)
        {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new AppException(ErrorCode.EXISTED_DATA);
        }

        Review review = reviewMapper.toReview(request);

        review.setUserId(booking.getUserId());
        review.setVehicleId(booking.getVehicleId());

        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getReviewsByVehicle(String vehicleId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Review> pageData = reviewRepository.findByVehicleId(vehicleId, pageable);

        var reviewResponses = pageData.getContent().stream()
                .map(reviewMapper::toReviewResponse)
                .toList();

        return PageResponse.<ReviewResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(reviewResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getReviewsByBranch(String branchId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Review> pageData = reviewRepository.findByBranchId(branchId, pageable);

        var reviewResponses = pageData.getContent().stream()
                .map(reviewMapper::toReviewResponse)
                .toList();

        return PageResponse.<ReviewResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(reviewResponses)
                .build();
    }
    @Transactional
    public void deleteReview(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        if (!isAdmin) {
            User user = userRepository.findById(review.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            if (!user.getEmail().equals(auth.getName())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
        reviewRepository.delete(review);
    }

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> filterReviews( String bookingId, String vehicleId,
                                                       String userId, Integer rating,
                                                       int page, int size)
    {

        Pageable pageable = PageRequest.of(page - 1, size);

        Specification<Review> specification = ReviewSpecification.filterReviews(bookingId, vehicleId, userId, rating);

        Page<Review> pageData = reviewRepository.findAll(specification, pageable);

        var reviewResponses = pageData.getContent().stream()
                .map(reviewMapper::toReviewResponse)
                .toList();

        return PageResponse.<ReviewResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(reviewResponses)
                .build();

    }

    @Transactional(readOnly = true)
    public PageResponse<PublicReviewResponse> filterPublicReviews(String vehicleId, Integer rating, int page, int size)
    {

        Pageable pageable = PageRequest.of(page - 1, size);

        Specification<Review> specification = ReviewSpecification
                .filterReviews(null, vehicleId, null, rating);

        Page<Review> pageData = reviewRepository.findAll(specification, pageable);

        var reviewResponses = pageData.getContent().stream()
                .map(reviewMapper::toPublicReviewResponse)
                .toList();

        return PageResponse.<PublicReviewResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(reviewResponses)
                .build();

    }

}
