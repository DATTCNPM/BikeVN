package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.VehicleCreationRequest;
import com.backend.bikerental.dto.request.VehicleUpdateRequest;
import com.backend.bikerental.dto.response.VehicleResponse;
import com.backend.bikerental.dto.response.VehicleImageResponse;
import com.backend.bikerental.entity.Vehicle;
import com.backend.bikerental.entity.VehicleImage;
import com.backend.bikerental.enums.StatusVehicleEnum;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.VehicleMapper;
import com.backend.bikerental.mapper.VehicleImageMapper;
import com.backend.bikerental.repository.BranchRepository;
import com.backend.bikerental.repository.VehicleBrandRepository;
import com.backend.bikerental.repository.VehicleModelRepository;
import com.backend.bikerental.repository.VehicleImageRepository;
import com.backend.bikerental.repository.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleService {
    VehicleRepository vehicleRepository;
    VehicleMapper vehicleMapper;
    VehicleImageRepository vehicleImageRepository;
    VehicleImageMapper vehicleImageMapper;
    VehicleImageStorageService vehicleImageStorageService;
    VehicleBrandRepository vehicleBrandRepository;
    VehicleModelRepository vehicleModelRepository;
    BranchRepository branchRepository;
    @Transactional
    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public VehicleResponse createVehicle(VehicleCreationRequest request)
    {
        var brand = vehicleBrandRepository.findById(request.getBrandId())
                .orElseThrow(()-> new AppException(ErrorCode.BRAND_NOT_EXISTED));
        var model = vehicleModelRepository.findById(request.getModelId())
                .orElseThrow(()-> new AppException(ErrorCode.MODEL_NOT_EXISTED));
        var branch = branchRepository.findById(request.getCurrentBranchId())
                .orElseThrow(()-> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        if (request.getBrandId() == null) {
            throw new IllegalArgumentException("brandId is null from request!");
        }
        if (request.getModelId() == null) {
            throw new IllegalArgumentException("modelId is null from request!");
        }
        Vehicle vehicle = vehicleMapper.toVehicle(request);
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        vehicle.setCurrentBranch(branch);
        return vehicleMapper.toVehicleResponse(vehicleRepository.save(vehicle));
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getAllVehicles()
    {
        return vehicleMapper.toListVehicleResponse(vehicleRepository.findAll());
    }

    @Transactional(readOnly = true)
    public VehicleResponse getVehicle(String id)
    {
        return vehicleMapper.toVehicleResponse(vehicleRepository.findById(id).orElseThrow(()->
                new AppException(ErrorCode.VEHICLE_NOT_EXISTED)));
    }
    @Transactional
    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public VehicleResponse updateVehicle(String id, VehicleUpdateRequest request)
    {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(()->
                new AppException(ErrorCode.VEHICLE_NOT_EXISTED));
        vehicleMapper.updateVehicle(vehicle, request);
        return vehicleMapper.toVehicleResponse(vehicleRepository.save(vehicle));
    }
    @Transactional
    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public void deleteVehicle(String id)
    {
        vehicleRepository.deleteById(id);
    }

    @Transactional
    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public void updateVehicleStatus(String id, StatusVehicleEnum status)
    {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        vehicle.setStatus(status);
        vehicleRepository.save(vehicle);
    }


    @Transactional
    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public VehicleImageResponse addVehicleImage(String vehicleId, MultipartFile file,
                                                String altText, Integer displayOrder,
                                                Boolean isPrimary) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        VehicleImage image = new VehicleImage();
        image.setVehicle(vehicle);
        image.setImageUrl(vehicleImageStorageService.store(file));
        image.setAltText(altText);
        if (displayOrder == null) {
            image.setDisplayOrder(0);
        } else {
            image.setDisplayOrder(displayOrder);
        }
        if (Boolean.TRUE.equals(isPrimary)) {
            vehicle.getImages().forEach(existing -> existing.setIsPrimary(false));
            image.setIsPrimary(true);
        }
        if (isPrimary == null) {
            image.setIsPrimary(false);
        }

        return vehicleImageMapper.toVehicleImageResponse(vehicleImageRepository.saveAndFlush(image));
    }

    @Transactional(readOnly = true)
    public List<VehicleImageResponse> getVehicleImages(String vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new AppException(ErrorCode.VEHICLE_NOT_EXISTED);
        }
        return vehicleImageMapper.toListVehicleImageResponse(
                vehicleImageRepository.findByVehicle_IdOrderByDisplayOrderAsc(vehicleId));
    }

    @Transactional
    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public VehicleImageResponse updateVehicleImage(String vehicleId, String imageId, MultipartFile file, String altText, Integer displayOrder, Boolean isPrimary) {
        VehicleImage image = vehicleImageRepository.findByIdAndVehicle_Id(imageId, vehicleId)
                .orElseThrow(() -> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        if (file != null && !file.isEmpty()) {
            vehicleImageStorageService.delete(image.getImageUrl());
            image.setImageUrl(vehicleImageStorageService.store(file));
        }
        if (altText != null) {
            image.setAltText(altText);
        }
        if (displayOrder != null) {
            image.setDisplayOrder(displayOrder);
        }
        if (Boolean.TRUE.equals(isPrimary)) {
            vehicleImageRepository.findByVehicle_IdOrderByDisplayOrderAsc(vehicleId)
                    .forEach(existing -> existing.setIsPrimary(false));
            image.setIsPrimary(true);
        } else if (isPrimary != null) {
            image.setIsPrimary(false);
        }
        return vehicleImageMapper.toVehicleImageResponse(vehicleImageRepository.save(image));
    }

    @Transactional
    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public void deleteVehicleImage(String vehicleId, String imageId) {
        VehicleImage image = vehicleImageRepository.findByIdAndVehicle_Id(imageId, vehicleId)
                .orElseThrow(() -> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));
        vehicleImageStorageService.delete(image.getImageUrl());
        vehicleImageRepository.delete(image);
    }
}
