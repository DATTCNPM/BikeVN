package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.VehicleModelCreationRequest;
import com.backend.bikerental.dto.request.VehicleModelUpdateRequest;
import com.backend.bikerental.dto.response.VehicleModelResponse;
import com.backend.bikerental.entity.VehicleModel;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VehicleModelMapper {
    VehicleModel toVehicleModel(VehicleModelCreationRequest request);
    @Mapping(source = "brand.id", target = "brandId")
    VehicleModelResponse toVehicleModelResponse(VehicleModel vehicleModel);
    List<VehicleModelResponse> toListVehicleModelResponse(List<VehicleModel> vehicleModels);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateModel(@MappingTarget VehicleModel model, VehicleModelUpdateRequest request);
}
