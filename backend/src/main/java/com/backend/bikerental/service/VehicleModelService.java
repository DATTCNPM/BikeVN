package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.VehicleModelCreationRequest;
import com.backend.bikerental.dto.request.VehicleModelUpdateRequest;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.VehicleModelResponse;
import com.backend.bikerental.entity.VehicleModel;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.VehicleModelMapper;
import com.backend.bikerental.repository.VehicleBrandRepository;
import com.backend.bikerental.repository.VehicleModelRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleModelService {
    VehicleModelRepository vehicleModelRepository;
    VehicleBrandRepository vehicleBrandRepository;
    VehicleModelMapper vehicleModelMapper;
    @PreAuthorize("hasRole('admin')")
    public VehicleModelResponse createModel(VehicleModelCreationRequest request)
    {
        if(vehicleModelRepository.existsByName(request.getName()))
        {
            throw new AppException(ErrorCode.MODEL_EXISTED);
        }

        if (request.getBrandId() == null) {
            throw new AppException(ErrorCode.BRAND_NOT_EXISTED);
        }

        VehicleModel vehicleModel = vehicleModelMapper.toVehicleModel(request);
        vehicleModel.setBrand(vehicleBrandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED)));

        return vehicleModelMapper.toVehicleModelResponse(vehicleModelRepository.save(vehicleModel));
    }
    @Transactional(readOnly = true)
    public VehicleModelResponse getModel(int id)
    {
        return vehicleModelMapper.toVehicleModelResponse(vehicleModelRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.MODEL_NOT_EXISTED)));
    }

    @Transactional(readOnly = true)
    public PageResponse<VehicleModelResponse> getAllModels(int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<VehicleModel> pageData = vehicleModelRepository.findAll(pageable);

        var modelResponses = pageData.getContent().stream()
                .map(vehicleModelMapper::toVehicleModelResponse)
                .toList();

        return PageResponse.<VehicleModelResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(modelResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public List<VehicleModelResponse> getAllModelsUnPaged()
    {
        return vehicleModelMapper.toListVehicleModelResponse(vehicleModelRepository.findAll());
    }

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public VehicleModelResponse updateModel(int id, VehicleModelUpdateRequest request)
    {
        VehicleModel vehicleModel = vehicleModelRepository.findById(id)
            .orElseThrow(()-> new AppException(ErrorCode.MODEL_NOT_EXISTED));

        if(request.getName() != null && !request.getName().equals(vehicleModel.getName()))
        {
            if(vehicleModelRepository.existsByName(request.getName()))
            {
                throw new AppException(ErrorCode.MODEL_EXISTED);
            }
        }

        vehicleModelMapper.updateModel(vehicleModel, request);

        if (request.getBrandId() != null) {
            vehicleModel.setBrand(vehicleBrandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED)));
        }

        return vehicleModelMapper.toVehicleModelResponse(vehicleModelRepository.save(vehicleModel));
    }

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public void deleteModel(int id)
    {
        if(!vehicleModelRepository.existsById(id))
        {
            throw new AppException(ErrorCode.MODEL_NOT_EXISTED);
        }
        vehicleModelRepository.deleteById(id);
    }
}
