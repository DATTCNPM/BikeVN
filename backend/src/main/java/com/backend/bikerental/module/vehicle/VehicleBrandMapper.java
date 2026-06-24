package com.backend.bikerental.module.vehicle;

import com.backend.bikerental.module.vehicle.dto.VehicleBrandCreationRequest;
import com.backend.bikerental.module.vehicle.dto.VehicleBrandResponse;
import com.backend.bikerental.module.vehicle.dto.VehicleBrandUpdateRequest;
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
