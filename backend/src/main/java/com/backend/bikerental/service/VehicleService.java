package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.VehicleCreationRequest;
import com.backend.bikerental.dto.request.VehicleUpdateRequest;
import com.backend.bikerental.dto.response.VehicleResponse;
import com.backend.bikerental.entity.Vehicle;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.VehicleMapper;
import com.backend.bikerental.repository.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleService {
    VehicleRepository vehicleRepository;
    VehicleMapper vehicleMapper;
    public VehicleResponse createVehicle(VehicleCreationRequest request)
    {
        Vehicle vehicle = vehicleMapper.toVehicle(request);
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
