package com.backend.bikerental.module.user;

import com.backend.bikerental.core.dto.ApiResponse;
import com.backend.bikerental.core.dto.PageResponse;
import com.backend.bikerental.module.user.dto.UserCreationRequest;
import com.backend.bikerental.module.user.dto.UserResponse;
import com.backend.bikerental.module.user.dto.UserUpdateRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody UserCreationRequest request)
    {
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.createUser(request));
        return apiResponse;
    }

    @PostMapping("/employee")
    ApiResponse<UserResponse> createEmployee(@RequestBody UserCreationRequest request)
    {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createEmployee(request))
                .build();
    }

    @GetMapping
    ApiResponse<PageResponse<UserResponse>> getAllUsers(@RequestParam(value = "page", defaultValue = "1") int page,
                                                        @RequestParam(value = "size", defaultValue = "10") int size)
    {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.getAllUsers(page, size))
                .build();
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo()
    {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @GetMapping("/customers")
    public ApiResponse<PageResponse<UserResponse>> getCustomers(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.getAllCustomers(page, size))
                .build();
    }

    @GetMapping("/employees")
    public ApiResponse<PageResponse<UserResponse>> getEmployees(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.getAllEmployees(page, size))
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId)
    {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable("userId") String userId,
                                         @RequestBody UserUpdateRequest request)
    {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    @DeleteMapping("/{userId}")
    ApiResponse<Void> deleteUser(@PathVariable("userId") String userId)
    {
        userService.deleteUser(userId);
        return ApiResponse.<Void>builder()
                .message("User Deleted")
                .build();
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public ApiResponse<PageResponse<UserResponse>> filterUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String branchId,
            @RequestParam(required = false) String roleName,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        if (!isAdmin && auth instanceof JwtAuthenticationToken jwtToken) {
            branchId = (String) jwtToken.getTokenAttributes().get("branchId");
        }

        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.filterUsers(keyword, isActive, branchId, roleName, page, size))
                .build();
    }
}

