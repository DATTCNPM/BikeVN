package com.backend.bikerental.module.vehicle;

import com.backend.bikerental.core.dto.ApiResponse;
import com.backend.bikerental.core.dto.PageResponse;
import com.backend.bikerental.module.vehicle.dto.VehicleBrandCreationRequest;
import com.backend.bikerental.module.vehicle.dto.VehicleBrandResponse;
import com.backend.bikerental.module.vehicle.dto.VehicleBrandUpdateRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle-brands")
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
    ApiResponse<PageResponse<VehicleBrandResponse>> getAllBrand(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size)
    {
        return ApiResponse.<PageResponse<VehicleBrandResponse>>builder()
                .result(vehicleBrandService.getAllBranches(page, size))
                .build();
    }

    @GetMapping("/all")
    ApiResponse<List<VehicleBrandResponse>> getAllBrandsUnPaged()
    {
        return ApiResponse.<List<VehicleBrandResponse>>builder()
                .result(vehicleBrandService.getAllBranchesUnPaged())
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

    @GetMapping("/filter")
    public ApiResponse<PageResponse<VehicleBrandResponse>> filterVehicleBrands
            (@RequestParam(required = false) String name,
             @RequestParam(required = false) String country,
             @RequestParam(defaultValue = "1") int page,
             @RequestParam(defaultValue = "10") int size)
    {
        return ApiResponse.<PageResponse<VehicleBrandResponse>>builder()
                .result(vehicleBrandService.filterVehicleBrands(name, country, page, size))
                .build();
    }

}
