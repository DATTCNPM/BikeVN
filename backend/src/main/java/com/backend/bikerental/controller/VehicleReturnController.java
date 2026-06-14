package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.VehicleReturnRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.VehicleReturnResponse;
import com.backend.bikerental.service.VehicleReturnService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/bookings/returns")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleReturnController {
    VehicleReturnService vehicleReturnService;

    @PostMapping(consumes = MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<VehicleReturnResponse> createReturn(@ModelAttribute VehicleReturnRequest request)
    {
        return ApiResponse.<VehicleReturnResponse>builder()
                .result(vehicleReturnService.createReturn(request))
                .build();
    }

    @GetMapping("booking/{bookingId}")
    public ApiResponse<VehicleReturnResponse> getReturnByBookingId(@PathVariable String bookingId)
    {
        return ApiResponse.<VehicleReturnResponse>builder()
                .result(vehicleReturnService.getReturnByBookingId(bookingId))
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<PageResponse<VehicleReturnResponse>> getAllReturns(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<VehicleReturnResponse>>builder()
                .result(vehicleReturnService.getAllReturns(page, size))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<VehicleReturnResponse>> getAllReturnsPerBranch(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<VehicleReturnResponse>>builder()
                .result(vehicleReturnService.getAllReturnsPerBranch(page, size))
                .build();
    }
}
