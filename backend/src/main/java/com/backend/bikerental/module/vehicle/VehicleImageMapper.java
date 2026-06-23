package com.backend.bikerental.module.vehicle;

import com.backend.bikerental.module.vehicle.dto.VehicleImageCreationRequest;
import com.backend.bikerental.module.vehicle.dto.VehicleImageResponse;
import com.backend.bikerental.module.vehicle.dto.VehicleImageUpdateRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VehicleImageMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    VehicleImage toVehicleImage(VehicleImageCreationRequest request);

    @Mapping(source = "vehicle.id", target = "vehicleId")
    VehicleImageResponse toVehicleImageResponse(VehicleImage vehicleImage);

    List<VehicleImageResponse> toListVehicleImageResponse(List<VehicleImage> vehicleImages);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateVehicleImage(@MappingTarget VehicleImage vehicleImage, VehicleImageUpdateRequest request);
}