package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.RoleRequest;
import com.backend.bikerental.dto.response.PermissionResponse;
import com.backend.bikerental.dto.response.RoleResponse;
import com.backend.bikerental.entity.Permission;
import com.backend.bikerental.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {PermissionMapper.class})
public interface RoleMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);
    
    @Mapping(target = "permissions", source = "permissions")
    RoleResponse toRoleResponse(Role role);

    default Set<PermissionResponse> mapPermissionsToResponses(Set<Permission> permissions) {
        if (permissions == null) {
            return null;
        }
        return permissions.stream()
                .map(this::convertToPermissionResponse)
                .collect(Collectors.toSet());
    }
    
    default PermissionResponse convertToPermissionResponse(Permission permission) {
        if (permission == null) {
            return null;
        }
        return PermissionResponse.builder()
                .name(permission.getName())
                .description(permission.getDescription())
                .build();
    }
}
