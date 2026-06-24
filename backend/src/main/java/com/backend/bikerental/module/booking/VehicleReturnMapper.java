package com.backend.bikerental.module.booking;

import com.backend.bikerental.module.booking.VehicleReturn;
import com.backend.bikerental.module.booking.dto.VehicleReturnRequest;
import com.backend.bikerental.module.booking.dto.VehicleReturnResponse;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VehicleReturnMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "images", ignore = true)
    VehicleReturn toVehicleReturn(VehicleReturnRequest request);

    VehicleReturnResponse toVehicleReturnResponse(VehicleReturn vehicleReturn);

    List<VehicleReturnResponse> toListVehicleReturnResponse(List<VehicleReturn> vehicleReturns);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "images", ignore = true)
    void updateVehicleReturn(@MappingTarget VehicleReturn vehicleReturn, VehicleReturnRequest request);
}
