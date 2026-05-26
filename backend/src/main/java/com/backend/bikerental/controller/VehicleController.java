package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.VehicleCreationRequest;
import com.backend.bikerental.dto.request.VehicleUpdateRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.VehicleResponse;
import com.backend.bikerental.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {
    @Autowired
    VehicleService vehicleService;

    @PostMapping
    ApiResponse<VehicleResponse> createVehicle(@RequestBody VehicleCreationRequest request)
    {
        return ApiResponse.<VehicleResponse>builder()
                .result(vehicleService.createVehicle(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<VehicleResponse>> getAllVehicles()
    {
        return ApiResponse.<List<VehicleResponse>>builder()
                .result(vehicleService.getAllVehicles())
                .build();
    }

    @GetMapping("/{vehicleId}")
    ApiResponse<VehicleResponse> getVehicles(@PathVariable("vehicleId") String id)
    {
        return ApiResponse.<VehicleResponse>builder()
                .result(vehicleService.getVehicle(id))
                .build();
    }

    @PutMapping("/{vehicleId}")
    ApiResponse<VehicleResponse> updateVehicle(@PathVariable("vehicleId") String id, VehicleUpdateRequest request)
    {
        return ApiResponse.<VehicleResponse>builder()
                .result(vehicleService.updateVehicle(id, request))
                .build();
    }

    @DeleteMapping("/{vehicleId}")
    ApiResponse<Void> deleteVehicle(@PathVariable("vehicleId") String id)
    {
        vehicleService.deleteVehicle(id);
        return ApiResponse.<Void>builder()
                .message("Vehicle deleted")
                .build();
    }
}
