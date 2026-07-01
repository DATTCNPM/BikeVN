package com.backend.bikerental.module.booking;

import com.backend.bikerental.core.dto.ApiResponse;
import com.backend.bikerental.core.dto.PageResponse;
import com.backend.bikerental.module.vehicle.enums.VehicleConditionStatus;
import com.backend.bikerental.module.booking.dto.VehicleReturnRequest;
import com.backend.bikerental.module.booking.dto.VehicleReturnResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

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

    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public ApiResponse<PageResponse<VehicleReturnResponse>> filterReturns(
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String returnBranchId,
            @RequestParam(required = false) VehicleConditionStatus conditionStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ApiResponse.<PageResponse<VehicleReturnResponse>>builder()
                .result(vehicleReturnService.filterReturns(bookingId, returnBranchId,
                        conditionStatus, fromDate, toDate, page, size))
                .build();
    }
}
