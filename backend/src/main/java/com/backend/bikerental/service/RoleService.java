package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.RoleRequest;
import com.backend.bikerental.dto.response.RoleResponse;
import com.backend.bikerental.entity.Permission;
import com.backend.bikerental.mapper.RoleMapper;
import com.backend.bikerental.repository.PermissionRepository;
import com.backend.bikerental.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;
    public RoleResponse create(RoleRequest request)
    {
        var role = roleMapper.toRole(request);
        var permissions = permissionRepository.findAllById(request.getPermissions() == null
                ? List.of() : request.getPermissions());
        Set<Permission> permissionSet = new HashSet<>();
        permissions.forEach(permissionSet::add);
        role.setPermissions(permissionSet);
        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public List<RoleResponse> getAllRoles()
    {
        var roles = roleRepository.findAll();
        return roles.stream().map(roleMapper::toRoleResponse).toList();
    }

    public void delete(String role)
    {
        roleRepository.deleteById(role);
    }
}
