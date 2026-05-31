package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.VehicleCreationRequest;
import com.backend.bikerental.dto.request.VehicleUpdateRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.VehicleResponse;
import com.backend.bikerental.dto.response.VehicleImageResponse;
import com.backend.bikerental.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    ApiResponse<VehicleResponse> getVehicle(@PathVariable("vehicleId") String id)
    {
        return ApiResponse.<VehicleResponse>builder()
                .result(vehicleService.getVehicle(id))
                .build();
    }

    @PutMapping("/{vehicleId}")
    ApiResponse<VehicleResponse> updateVehicle(@PathVariable("vehicleId") String id, @RequestBody VehicleUpdateRequest request)
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

        @PostMapping(value = "/{vehicleId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        ApiResponse<VehicleImageResponse> addVehicleImage(@PathVariable("vehicleId") String vehicleId,
                                                           @RequestPart("file") MultipartFile file,
                                                           @RequestParam(value = "altText", required = false) String altText,
                                                           @RequestParam(value = "displayOrder", required = false) Integer displayOrder,
                                                           @RequestParam(value = "isPrimary", required = false) Boolean isPrimary) {
        return ApiResponse.<VehicleImageResponse>builder()
                .result(vehicleService.addVehicleImage(vehicleId, file, altText, displayOrder, isPrimary))
            .build();
        }

        @GetMapping("/{vehicleId}/images")
        ApiResponse<List<VehicleImageResponse>> getVehicleImages(@PathVariable("vehicleId") String vehicleId) {
        return ApiResponse.<List<VehicleImageResponse>>builder()
            .result(vehicleService.getVehicleImages(vehicleId))
            .build();
        }

        @PutMapping(value = "/{vehicleId}/images/{imageId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        ApiResponse<VehicleImageResponse> updateVehicleImage(@PathVariable("vehicleId") String vehicleId,
                                 @PathVariable("imageId") String imageId,
                                 @RequestPart(value = "file", required = false) MultipartFile file,
                                 @RequestParam(value = "altText", required = false) String altText,
                                 @RequestParam(value = "displayOrder", required = false) Integer displayOrder,
                                 @RequestParam(value = "isPrimary", required = false) Boolean isPrimary) {
        return ApiResponse.<VehicleImageResponse>builder()
            .result(vehicleService.updateVehicleImage(vehicleId, imageId, file, altText, displayOrder, isPrimary))
            .build();
        }

        @DeleteMapping("/{vehicleId}/images/{imageId}")
        ApiResponse<Void> deleteVehicleImage(@PathVariable("vehicleId") String vehicleId,
                         @PathVariable("imageId") String imageId) {
        vehicleService.deleteVehicleImage(vehicleId, imageId);
        return ApiResponse.<Void>builder()
            .message("Vehicle image deleted")
            .build();
        }
}
