package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.BookingCreationRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.BookingResponse;
import com.backend.bikerental.service.BookingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public ApiResponse<BookingResponse> getBooking(@PathVariable String id)
    {
        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.getBooking(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BookingResponse>> getAllBooking()
    {
        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.getAllBooking())
                .build();
    }

    //get booking by user
    @GetMapping("/user/{userId}")
    public ApiResponse<List<BookingResponse>> getBookingsByUser(@PathVariable String userId)
    {
        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.getBookingsByUser(userId))
                .build();
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<Void> approveBooking(@PathVariable String id)
    {
        bookingService.approveBooking(id);
        return ApiResponse.<Void>builder()
                .message("Booking approved successfully")
                .build();
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<Void> cancelBooking(@PathVariable String id)
    {
        bookingService.cancelBooking(id);
        return ApiResponse.<Void>builder()
                .message("Booking canceled")
                .build();
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<Void> rejectBooking(@PathVariable String id)
    {
        bookingService.rejectBooking(id);
        return ApiResponse.<Void>builder()
                .message("Booking rejected successfully")
                .build();
    }
}
