package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.PermissionRequest;
import com.backend.bikerental.dto.response.PermissionResponse;
import com.backend.bikerental.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    @Mapping(target = "id", ignore = true)
    Permission toPermission(PermissionRequest request);
    
    PermissionResponse toPermissionResponse(Permission permission);
}
