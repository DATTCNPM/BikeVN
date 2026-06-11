package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.VehicleModelCreationRequest;
import com.backend.bikerental.dto.request.VehicleModelUpdateRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.VehicleModelResponse;
import com.backend.bikerental.service.VehicleModelService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/model")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleModelController {
    VehicleModelService vehicleModelService;
    @PostMapping
    ApiResponse<VehicleModelResponse> createModel(@RequestBody VehicleModelCreationRequest request)
    {
        return ApiResponse.<VehicleModelResponse>builder()
                .result(vehicleModelService.createModel(request))
                .build();
    }

    @GetMapping
    ApiResponse<PageResponse<VehicleModelResponse>> getAllModels(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size)
    {
        return ApiResponse.<PageResponse<VehicleModelResponse>>builder()
                .result(vehicleModelService.getAllModels(page, size))
                .build();
    }
    @GetMapping
    ApiResponse<List<VehicleModelResponse>> getAllModelsUnPaged()
    {
        return ApiResponse.<List<VehicleModelResponse>>builder()
                .result(vehicleModelService.getAllModelsUnPaged())
                .build();
    }

    @GetMapping("/{modelId}")
    ApiResponse<VehicleModelResponse> getModel(@PathVariable("modelId") int modelId)
    {
        return ApiResponse.<VehicleModelResponse>builder()
                .result(vehicleModelService.getModel(modelId))
                .build();
    }

    @PutMapping("/{modelId}")
    ApiResponse<VehicleModelResponse> updateModel(@PathVariable("modelId") int modelId,
                                                  @RequestBody VehicleModelUpdateRequest request)
    {
        return ApiResponse.<VehicleModelResponse>builder()
                .result(vehicleModelService.updateModel(modelId, request))
                .build();
    }

    @DeleteMapping("/{modelId}")
    ApiResponse<Void> deleteModel(@PathVariable("modelId") int modelId)
    {
        vehicleModelService.deleteModel(modelId);
        return ApiResponse.<Void>builder()
                .message("Model deleted")
                .build();
    }
}
