package com.backend.bikerental.module.review.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublicReviewResponse {
    String id;
    String vehicleId;
    int rating;
    String comment;
    LocalDateTime createdAt;
}
