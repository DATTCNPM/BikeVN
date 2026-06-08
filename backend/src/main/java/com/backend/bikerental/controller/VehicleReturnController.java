package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.VehicleReturnRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.VehicleReturnResponse;
import com.backend.bikerental.service.VehicleReturnService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/bookings/return")
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
}
