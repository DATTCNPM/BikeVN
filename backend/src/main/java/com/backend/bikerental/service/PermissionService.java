package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.PermissionRequest;
import com.backend.bikerental.dto.response.PermissionResponse;
import com.backend.bikerental.entity.Permission;
import com.backend.bikerental.mapper.PermissionMapper;
import com.backend.bikerental.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;
    public PermissionResponse create(PermissionRequest request)
    {
        Permission permission = permissionMapper.toPermission(request);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    public List<PermissionResponse> getAllPermissions()
    {
        var permission = permissionRepository.findAll();
        return permission.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    public void delete(String permission)
    {
        permissionRepository.deleteById(permission);
    }
}
