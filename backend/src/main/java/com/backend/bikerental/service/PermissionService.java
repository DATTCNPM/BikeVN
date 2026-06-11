package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.PermissionRequest;
import com.backend.bikerental.dto.response.PermissionResponse;
import com.backend.bikerental.entity.Permission;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.PermissionMapper;
import com.backend.bikerental.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public PermissionResponse create(PermissionRequest request)
    {
        if (permissionRepository.existsById(request.getName())) {
            throw new AppException(ErrorCode.PERMISSION_EXISTED);
        }
        Permission permission = permissionMapper.toPermission(request);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('admin')")
    public List<PermissionResponse> getAllPermissions()
    {
        var permission = permissionRepository.findAll();
        return permission.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('admin')")
    public PermissionResponse getPermission(String permissionName) {
        Permission permission = permissionRepository.findById(permissionName)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
        return permissionMapper.toPermissionResponse(permission);
    }

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public void delete(String permission)
    {
        if (!permissionRepository.existsById(permission)) {
            throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        }
        permissionRepository.deleteById(permission);
    }
}
