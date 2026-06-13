package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.PermissionRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.PermissionResponse;
import com.backend.bikerental.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/permissions")
public class PermissionController {
    PermissionService permissionService;
    @PostMapping
    ApiResponse<PermissionResponse> create(@RequestBody PermissionRequest request)
    {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<PermissionResponse>> getAll()
    {
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAllPermissions())
                .build();
    }

    @GetMapping("/{permission}")
    ApiResponse<PermissionResponse> getPermission(@PathVariable("permission") String permission)
    {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.getPermission(permission))
                .build();
    }

    @DeleteMapping("/{permission}")
    ApiResponse<String> delete(@PathVariable String permission)
    {
        permissionService.delete(permission);
        return ApiResponse.<String>builder()
                .message("Permission deleted")
                .build();
    }
}
