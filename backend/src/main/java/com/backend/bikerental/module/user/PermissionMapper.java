package com.backend.bikerental.module.user;

import com.backend.bikerental.module.user.dto.PermissionRequest;
import com.backend.bikerental.module.user.dto.PermissionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    @Mapping(target = "id", ignore = true)
    Permission toPermission(PermissionRequest request);
    
    PermissionResponse toPermissionResponse(Permission permission);
}
