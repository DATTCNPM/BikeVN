package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.BookingCreationRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.BookingResponse;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.enums.BookingStatus;
import com.backend.bikerental.service.BookingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {
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
    public ApiResponse<PageResponse<BookingResponse>> getAllBooking(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    )
    {
        return ApiResponse.<PageResponse<BookingResponse>>builder()
                .result(bookingService.getAllBooking(page, size))
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

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('user')")
    public ApiResponse<PageResponse<BookingResponse>> getMyBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String currentUserId = null;
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtToken) {
            currentUserId = (String) jwtToken.getTokenAttributes().get("userId");
        }

        return ApiResponse.<PageResponse<BookingResponse>>builder()
                .result(bookingService.filterBookings(currentUserId, null, null, status, fromDate, toDate, page, size))
                .build();
    }

    @GetMapping("/admin/filter")
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public ApiResponse<PageResponse<BookingResponse>> filterBookingsForAdmin(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String vehicleId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String branchId = null;
        var auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        if (!isAdmin && auth instanceof JwtAuthenticationToken jwtToken) {
            branchId = (String) jwtToken.getTokenAttributes().get("branchId");
        }

        return ApiResponse.<PageResponse<BookingResponse>>builder()
                .result(bookingService.filterBookings(userId, vehicleId, branchId, status, fromDate, toDate, page, size))
                .build();
    }
}
