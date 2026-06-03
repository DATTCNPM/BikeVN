package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.BookingCreationRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.BookingResponse;
import com.backend.bikerental.service.BookingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingController {
    @Autowired
    BookingService bookingService;
    @PostMapping
    ApiResponse<BookingResponse> createBooking(@RequestBody BookingCreationRequest request)
    {
        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.createBooking(request))
                .build();
    }
}
