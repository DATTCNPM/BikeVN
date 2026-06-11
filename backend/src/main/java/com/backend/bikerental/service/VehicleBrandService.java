package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.VehicleBrandCreationRequest;
import com.backend.bikerental.dto.request.VehicleBrandUpdateRequest;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.VehicleBrandResponse;
import com.backend.bikerental.entity.VehicleBrand;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.VehicleBrandMapper;
import com.backend.bikerental.repository.VehicleBrandRepository;
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
public class VehicleBrandService {
    VehicleBrandRepository vehicleBrandRepository;
    VehicleBrandMapper vehicleBrandMapper;

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public VehicleBrandResponse createBrand(VehicleBrandCreationRequest request)
    {
        if(vehicleBrandRepository.existsByName(request.getName()))
        {
            throw new AppException(ErrorCode.BRAND_EXISTED);
        }

        VehicleBrand vehicleBrand = vehicleBrandMapper.toVehicleBrand(request);
        return vehicleBrandMapper.toVehicleBrandResponse(vehicleBrandRepository.save(vehicleBrand));
    }

    @Transactional(readOnly = true)
    public VehicleBrandResponse getBrand(int id)
    {
        return vehicleBrandMapper.toVehicleBrandResponse(vehicleBrandRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BRAND_NOT_EXISTED)));
    }

    public PageResponse<VehicleBrandResponse> getAllBranches(int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<VehicleBrand> pageData = vehicleBrandRepository.findAll(pageable);

        var brandResponses =  pageData.getContent().stream()
                .map(vehicleBrandMapper::toVehicleBrandResponse)
                .toList();

        return PageResponse.<VehicleBrandResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(brandResponses)
                .build();
    }

    @Transactional
    public List<VehicleBrandResponse> getAllBranchesUnPaged()
    {
        return vehicleBrandMapper.toListVehicleBrandResponse(vehicleBrandRepository.findAll());
    }

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public VehicleBrandResponse updateBrand(int id, VehicleBrandUpdateRequest request)
    {
        VehicleBrand vehicleBrand = vehicleBrandRepository.findById(id)
            .orElseThrow(()-> new AppException(ErrorCode.BRAND_NOT_EXISTED));

        if(request.getName() != null && !request.getName().equals(vehicleBrand.getName()))
        {
            if(vehicleBrandRepository.existsByName(request.getName()))
            {
                throw new AppException(ErrorCode.BRAND_NOT_EXISTED);
            }
        }

        vehicleBrandMapper.updateBrand(vehicleBrand, request);
        return vehicleBrandMapper.toVehicleBrandResponse(vehicleBrandRepository.save(vehicleBrand));
    }

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public void deleteBrand(int id)
    {
        if(!vehicleBrandRepository.existsById(id))
        {
            throw new AppException(ErrorCode.BRAND_NOT_EXISTED);
        }

        vehicleBrandRepository.deleteById(id);
    }
}
