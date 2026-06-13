package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.VehicleCreationRequest;
import com.backend.bikerental.dto.request.VehicleUpdateRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.VehicleImageResponse;
import com.backend.bikerental.dto.response.VehicleResponse;
import com.backend.bikerental.enums.StatusVehicleEnum;
import com.backend.bikerental.service.VehicleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleController {
    VehicleService vehicleService;

    @PostMapping
    ApiResponse<VehicleResponse> createVehicle(@RequestBody VehicleCreationRequest request)
    {
        return ApiResponse.<VehicleResponse>builder()
                .result(vehicleService.createVehicle(request))
                .build();
    }

    @GetMapping
    ApiResponse<PageResponse<VehicleResponse>> getAllVehicles(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size)
    {
        return ApiResponse.<PageResponse<VehicleResponse>>builder()
                .result(vehicleService.getAllVehicles(page, size))
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
    @PatchMapping("/{vehicleId}/status")
    ApiResponse<Void> updateVehicleStatus(
            @PathVariable("vehicleId") String id,
            @RequestParam("status") StatusVehicleEnum status) {
        vehicleService.updateVehicleStatus(id, status);
        return ApiResponse.<Void>builder()
                .message("Update status vehicle successfully")
                .build();
    }

    @PostMapping("/{vehicleId}/images")
    public ApiResponse<List<VehicleImageResponse>> uploadVehicleImages(
            @PathVariable String vehicleId,
            @RequestParam("files") List<MultipartFile> files) {

        return ApiResponse.<List<VehicleImageResponse>>builder()
                .result(vehicleService.addVehicleImages(vehicleId, files))
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
