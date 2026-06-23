package com.backend.bikerental.module.review.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    String id;
    String bookingId;
    String userId;
    String vehicleId;
    int rating;
    String comment;
    LocalDateTime createdAt;
}
