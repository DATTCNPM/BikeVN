package com.backend.bikerental.module.user;

import com.backend.bikerental.module.user.dto.RoleRequest;
import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.backend.bikerental.module.user.dto.RoleResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    @PreAuthorize("hasRole('admin')")
    public RoleResponse createRole(RoleRequest request)
    {
        if (roleRepository.existsById(request.getName())) {
            throw new AppException(ErrorCode.ROLE_EXISTED);
        }

        var role = roleMapper.toRole(request);
        var permissions = permissionRepository.findAllById(request.getPermissions() == null
                ? List.of() : request.getPermissions());
        Set<Permission> permissionSet = new HashSet<>();
        permissions.forEach(permissionSet::add);
        role.setPermissions(permissionSet);

        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('admin')")
    public List<RoleResponse> getAllRoles()
    {
        var roles = roleRepository.findAll();
        return roles.stream().map(roleMapper::toRoleResponse).toList();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('admin')")
    public RoleResponse getRole(String roleName) {
        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        return roleMapper.toRoleResponse(role);
    }

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public void delete(String role)
    {
        roleRepository.deleteById(role);
    }
}
