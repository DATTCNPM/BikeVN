package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.VehicleBrandCreationRequest;
import com.backend.bikerental.dto.request.VehicleBrandUpdateRequest;
import com.backend.bikerental.dto.response.VehicleBrandResponse;
import com.backend.bikerental.entity.VehicleBrand;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VehicleBrandMapper {
    VehicleBrand toVehicleBrand(VehicleBrandCreationRequest request);
    VehicleBrandResponse toVehicleBrandResponse(VehicleBrand vehicleBrand);
    List<VehicleBrandResponse> toListVehicleBrandResponse(List<VehicleBrand> vehicleBrands);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBrand(@MappingTarget VehicleBrand brand, VehicleBrandUpdateRequest request);
}
