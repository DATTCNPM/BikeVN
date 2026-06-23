package com.backend.bikerental.module.vehicle;

import com.backend.bikerental.module.vehicle.dto.VehicleModelCreationRequest;
import com.backend.bikerental.module.vehicle.dto.VehicleModelResponse;
import com.backend.bikerental.module.vehicle.dto.VehicleModelUpdateRequest;
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
