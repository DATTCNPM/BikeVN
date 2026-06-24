package com.backend.bikerental.module.user;

import com.backend.bikerental.module.user.dto.PermissionResponse;
import com.backend.bikerental.module.user.dto.RoleRequest;
import com.backend.bikerental.module.user.dto.RoleResponse;
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
