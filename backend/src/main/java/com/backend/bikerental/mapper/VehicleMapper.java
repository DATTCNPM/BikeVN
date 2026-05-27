package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.VehicleCreationRequest;
import com.backend.bikerental.dto.request.VehicleUpdateRequest;
import com.backend.bikerental.dto.response.VehicleResponse;
import com.backend.bikerental.entity.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VehicleMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "model", ignore = true)
    @Mapping(target = "currentBranch", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Vehicle toVehicle(VehicleCreationRequest request);

    @Mapping(source = "brand.id", target = "brandId")
    @Mapping(source = "model.id", target = "modelId")
    @Mapping(source = "currentBranch.id", target = "currentBranchId")
    VehicleResponse toVehicleResponse(Vehicle vehicle);

    default List<VehicleResponse> toListVehicleResponse(List<Vehicle> vehicles) {
        if (vehicles == null) {
            return null;
        }
        return vehicles.stream()
                .map(this::toVehicleResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    void updateVehicle(@MappingTarget Vehicle vehicle, VehicleUpdateRequest request);
}