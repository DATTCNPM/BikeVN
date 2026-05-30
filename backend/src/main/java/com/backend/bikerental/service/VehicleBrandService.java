package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.VehicleBrandCreationRequest;
import com.backend.bikerental.dto.request.VehicleBrandUpdateRequest;
import com.backend.bikerental.dto.response.VehicleBrandResponse;
import com.backend.bikerental.entity.VehicleBrand;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.VehicleBrandMapper;
import com.backend.bikerental.repository.VehicleBrandRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleBrandService {
    VehicleBrandRepository vehicleBrandRepository;
    VehicleBrandMapper vehicleBrandMapper;
    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public VehicleBrandResponse createBrand(VehicleBrandCreationRequest request)
    {
        if(vehicleBrandRepository.existsByName(request.getName()))
        {
            throw new AppException(ErrorCode.BRAND_EXISTED);
        }
        VehicleBrand vehicleBrand = vehicleBrandMapper.toVehicleBrand(request);
        return vehicleBrandMapper.toVehicleBrandResponse(vehicleBrandRepository.save(vehicleBrand));
    }

    public VehicleBrandResponse getBrand(int id)
    {
        return vehicleBrandMapper.toVehicleBrandResponse(vehicleBrandRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BRAND_NOT_EXISTED)));
    }

    public List<VehicleBrandResponse> getAllBranches()
    {
        return vehicleBrandMapper.toListVehicleBrandResponse(vehicleBrandRepository.findAll());
    }

    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public VehicleBrandResponse updateBrand(int id, VehicleBrandUpdateRequest request)
    {
        VehicleBrand vehicleBrand = vehicleBrandRepository.findById(id)
            .orElseThrow(()-> new AppException(ErrorCode.BRAND_NOT_EXISTED));
        vehicleBrandMapper.updateBrand(vehicleBrand, request);
        return vehicleBrandMapper.toVehicleBrandResponse(vehicleBrandRepository.save(vehicleBrand));
    }

    @PreAuthorize("hasRole('admin') or hasRole('employee')")
    public void deleteBrand(int id)
    {
        vehicleBrandRepository.deleteById(id);
    }
}
