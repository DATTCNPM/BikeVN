package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.UserCreationRequest;
import com.backend.bikerental.dto.request.UserUpdateRequest;
import com.backend.bikerental.dto.response.UserResponse;
import com.backend.bikerental.entity.Role;
import com.backend.bikerental.entity.User;
import com.backend.bikerental.enums.RoleEnum;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.UserMapper;
import com.backend.bikerental.repository.RoleRepository;
import com.backend.bikerental.repository.UserRepository;
import com.backend.bikerental.entity.Branch;
import com.backend.bikerental.repository.BranchRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    BranchRepository branchRepository;
    public UserResponse createUser(UserCreationRequest request)
    {
        if(userRepository.existsByEmail(request.getEmail()))
        {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

        var role = roleRepository.findByName(RoleEnum.user.name())
                .orElseGet(()-> {
                    var newRole = Role.builder()
                            .name(RoleEnum.user.name())
                            .description("User role")
                            .build();
                    return roleRepository.save(newRole);
                });
        user.setRoles(Set.of(role));
        user.setBranch(null);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('admin')")
    public UserResponse createEmployee(UserCreationRequest request)
    {
        if(userRepository.existsByEmail(request.getEmail()))
        {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));


        var role = roleRepository.findByName(RoleEnum.employee.name())
                .orElseGet(()-> {
                    var newRole = Role.builder()
                            .name(RoleEnum.employee.name())
                            .description("Employee role")
                            .build();
                    return roleRepository.save(newRole);
                });
        user.setRoles(Set.of(role));
        if (request.getBranchId() != null && !request.getBranchId().isBlank()) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
            user.setBranch(branch);
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('admin')")
    public List<UserResponse> getAllUsers()
    {
        return userMapper.toListUsersResponse(userRepository.findAll());
    }

    @PostAuthorize("hasRole('admin') or returnObject.email == authentication.name")
    public UserResponse getUser(String id)
    {
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    public UserResponse updateUser(String id, UserUpdateRequest request)
    {
        User user = userRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        userMapper.updateUser(user, request);
        if(request.getPassword() != null && !request.getPassword().isBlank())
        {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        boolean requiresBranch = user.getRoles().stream()
                .anyMatch(role -> !RoleEnum.user.name().equalsIgnoreCase(role.getName())
                        && !RoleEnum.admin.name().equalsIgnoreCase(role.getName()));

        if (requiresBranch) {
            if (request.getBranchId() != null) {
                if (request.getBranchId().isBlank()) {
                    user.setBranch(null);
                } else {
                    Branch branch = branchRepository.findById(request.getBranchId())
                            .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
                    user.setBranch(branch);
                }
            }
        } else {
            user.setBranch(null);
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }


    public void deleteUser(String id)
    {
        userRepository.deleteById(id);
    }

    public UserResponse getMyInfo()
    {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

}
