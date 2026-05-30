package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.VehicleBrandCreationRequest;
import com.backend.bikerental.dto.request.VehicleBrandUpdateRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.VehicleBrandResponse;
import com.backend.bikerental.service.VehicleBrandService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brand")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleBrandController {
    VehicleBrandService vehicleBrandService;
    @PostMapping
    ApiResponse<VehicleBrandResponse> createBrand(@RequestBody VehicleBrandCreationRequest request)
    {
        return ApiResponse.<VehicleBrandResponse>builder()
                .result(vehicleBrandService.createBrand(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<VehicleBrandResponse>> getAllBrands()
    {
        return ApiResponse.<List<VehicleBrandResponse>>builder()
                .result(vehicleBrandService.getAllBranches())
                .build();
    }

    @GetMapping("/{brandId}")
    ApiResponse<VehicleBrandResponse> getBrand(@PathVariable("brandId") int brandId)
    {
        return ApiResponse.<VehicleBrandResponse>builder()
                .result(vehicleBrandService.getBrand(brandId))
                .build();
    }

    @PutMapping("/{brandId}")
    ApiResponse<VehicleBrandResponse> updateBrand(@PathVariable("brandId") int brandId,
                                                  @RequestBody VehicleBrandUpdateRequest request)
    {
        return ApiResponse.<VehicleBrandResponse>builder()
                .result(vehicleBrandService.updateBrand(brandId, request))
                .build();
    }

    @DeleteMapping("/{brandId}")
    ApiResponse<Void> deleteBrand(@PathVariable("brandId") int brandId)
    {
        vehicleBrandService.deleteBrand(brandId);
        return ApiResponse.<Void>builder()
                .message("Brand deleted")
                .build();
    }
}
