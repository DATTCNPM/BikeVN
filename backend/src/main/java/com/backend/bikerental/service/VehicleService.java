package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.VehicleCreationRequest;
import com.backend.bikerental.dto.request.VehicleUpdateRequest;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.VehicleImageResponse;
import com.backend.bikerental.dto.response.VehicleResponse;
import com.backend.bikerental.entity.Vehicle;
import com.backend.bikerental.entity.VehicleImage;
import com.backend.bikerental.enums.StatusVehicleEnum;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.VehicleImageMapper;
import com.backend.bikerental.mapper.VehicleMapper;
import com.backend.bikerental.repository.*;
import com.backend.bikerental.util.BranchSecurityUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleService {
    VehicleRepository vehicleRepository;
    VehicleMapper vehicleMapper;
    VehicleImageRepository vehicleImageRepository;
    VehicleImageMapper vehicleImageMapper;
    VehicleBrandRepository vehicleBrandRepository;
    VehicleModelRepository vehicleModelRepository;
    BranchRepository branchRepository;
    BranchSecurityUtil branchSecurityUtil;
    FileStorageService fileStorageService;
    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public VehicleResponse createVehicle(VehicleCreationRequest request)
    {
        if(request.getBrandId() == null || request.getModelId() == null || request.getCurrentBranchId() == null)
        {
            throw new AppException(ErrorCode.INVALID_KEY);
        }

        branchSecurityUtil.verifyBranchAccess(request.getCurrentBranchId());

        var brand = vehicleBrandRepository.findById(request.getBrandId())
                .orElseThrow(()-> new AppException(ErrorCode.BRAND_NOT_EXISTED));
        var model = vehicleModelRepository.findById(request.getModelId())
                .orElseThrow(()-> new AppException(ErrorCode.MODEL_NOT_EXISTED));
        var branch = branchRepository.findById(request.getCurrentBranchId())
                .orElseThrow(()-> new AppException(ErrorCode.BRANCH_NOT_EXISTED));

        Vehicle vehicle = vehicleMapper.toVehicle(request);
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        vehicle.setCurrentBranch(branch);
        return vehicleMapper.toVehicleResponse(vehicleRepository.save(vehicle));
    }

    @Transactional(readOnly = true)
    public PageResponse<VehicleResponse> getAllVehicles(int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Vehicle> pageData = vehicleRepository.findAll(pageable);

        var vehicleResponses = pageData.getContent().stream()
                .map(vehicleMapper::toVehicleResponse)
                .toList();

        return PageResponse.<VehicleResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(vehicleResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public VehicleResponse getVehicle(String id)
    {
        return vehicleMapper.toVehicleResponse(vehicleRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED)));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public VehicleResponse updateVehicle(String id, VehicleUpdateRequest request)
    {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        String currentBranchId = vehicle.getCurrentBranch() != null ? vehicle.getCurrentBranch().getId() : null;
        branchSecurityUtil.verifyBranchAccess(currentBranchId);

        vehicleMapper.updateVehicle(vehicle, request);
        return vehicleMapper.toVehicleResponse(vehicleRepository.save(vehicle));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public void deleteVehicle(String id)
    {
        Vehicle vehicle = vehicleRepository.findById(id)
                        .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));
        String currentBranchId = vehicle.getCurrentBranch() != null ? vehicle.getCurrentBranch().getId() : null;

        branchSecurityUtil.verifyBranchAccess(currentBranchId);

        vehicleRepository.deleteById(id);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public void updateVehicleStatus(String id, StatusVehicleEnum status)
    {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        String vehicleBranchId = vehicle.getCurrentBranch() != null ? vehicle.getCurrentBranch().getId() : null;
        branchSecurityUtil.verifyBranchAccess(vehicleBranchId);

        vehicle.setStatus(status);
        vehicleRepository.save(vehicle);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public List<VehicleImageResponse> addVehicleImages(String vehicleId, List<MultipartFile> files)
    {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        String vehicleBranchId = vehicle.getCurrentBranch() != null ? vehicle.getCurrentBranch().getId() : null;
        branchSecurityUtil.verifyBranchAccess(vehicleBranchId);

        if(files == null || files.isEmpty())
        {
            return new ArrayList<>();
        }
        List<VehicleImage> savedImages = new ArrayList<>();

        boolean hasPrimary = vehicle.getImages().stream().anyMatch(VehicleImage::getIsPrimary);

        int currentMaxOrder = vehicle.getImages().stream()
                .mapToInt(img -> img.getDisplayOrder() != null ? img.getDisplayOrder() : 0)
                .max()
                .orElse(-1);
        for(int i = 0; i < files.size(); i++)
        {
            MultipartFile file = files.get(i);
            if (file == null || file.isEmpty())
            {
                continue;
            }

            String storedUrl = fileStorageService.storeVehicleImage(file);

            VehicleImage vehicleImage = new VehicleImage();
            vehicleImage.setVehicle(vehicle);
            vehicleImage.setImageUrl(storedUrl);
            vehicleImage.setAltText(vehicle.getName() + " image " + (currentMaxOrder + i + 2));
            vehicleImage.setDisplayOrder(currentMaxOrder + i + 1);

            if(!hasPrimary && i == 0)
            {
                vehicleImage.setIsPrimary(true);
                hasPrimary = true;
            }
            else {
                vehicleImage.setIsPrimary(false);
            }
            savedImages.add(vehicleImageRepository.save(vehicleImage));
        }
        return vehicleImageMapper.toListVehicleImageResponse(savedImages);
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
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public VehicleImageResponse updateVehicleImage(String vehicleId, String imageId,
                                                   MultipartFile file, String altText,
                                                   Integer displayOrder, Boolean isPrimary) {
        VehicleImage image = vehicleImageRepository.findByIdAndVehicle_Id(imageId, vehicleId)
                .orElseThrow(() -> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        if (file != null && !file.isEmpty()) {
            fileStorageService.delete(image.getImageUrl());
            image.setImageUrl(fileStorageService.storeVehicleImage(file));
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
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public void deleteVehicleImage(String vehicleId, String imageId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        String vehicleBranchId = vehicle.getCurrentBranch() != null ? vehicle.getCurrentBranch().getId() : null;
        branchSecurityUtil.verifyBranchAccess(vehicleBranchId);

        VehicleImage image = vehicleImageRepository.findByIdAndVehicle_Id(imageId, vehicleId)
                .orElseThrow(() -> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        fileStorageService.delete(image.getImageUrl());
        vehicleImageRepository.delete(image);
    }
}
