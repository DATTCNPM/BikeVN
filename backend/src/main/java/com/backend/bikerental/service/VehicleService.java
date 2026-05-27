package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.VehicleCreationRequest;
import com.backend.bikerental.dto.request.VehicleUpdateRequest;
import com.backend.bikerental.dto.response.VehicleResponse;
import com.backend.bikerental.entity.Vehicle;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.VehicleMapper;
import com.backend.bikerental.repository.BranchRepository;
import com.backend.bikerental.repository.VehicleBrandRepository;
import com.backend.bikerental.repository.VehicleModelRepository;
import com.backend.bikerental.repository.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleService {
    VehicleRepository vehicleRepository;
    VehicleMapper vehicleMapper;
    VehicleBrandRepository vehicleBrandRepository;
    VehicleModelRepository vehicleModelRepository;
    BranchRepository branchRepository;
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

    public List<VehicleResponse> getAllVehicles()
    {
        return vehicleMapper.toListVehicleResponse(vehicleRepository.findAll());
    }

    public VehicleResponse getVehicle(String id)
    {
        return vehicleMapper.toVehicleResponse(vehicleRepository.findById(id).orElseThrow(()->
                new AppException(ErrorCode.VEHICLE_NOT_EXISTED)));
    }

    public VehicleResponse updateVehicle(String id, VehicleUpdateRequest request)
    {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(()->
                new AppException(ErrorCode.VEHICLE_NOT_EXISTED));
        vehicleMapper.updateVehicle(vehicle, request);
        return vehicleMapper.toVehicleResponse(vehicleRepository.save(vehicle));
    }

    public void deleteVehicle(String id)
    {
        vehicleRepository.deleteById(id);
    }
}
