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
    Vehicle toVehicle(VehicleCreationRequest request);
    VehicleResponse toVehicleResponse(Vehicle vehicle);
    List<VehicleResponse> toListVehicleResponse(List<Vehicle> vehicles);
    void updateVehicle(@MappingTarget Vehicle vehicle, VehicleUpdateRequest request);
}
