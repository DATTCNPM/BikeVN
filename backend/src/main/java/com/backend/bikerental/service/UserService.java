package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.UserCreationRequest;
import com.backend.bikerental.dto.request.UserUpdateRequest;
import com.backend.bikerental.dto.response.PageResponse;
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
import com.backend.bikerental.specification.UserSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
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

    @Transactional
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

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('admin')")
    public PageResponse<UserResponse> getAllUsers(int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> pageData = userRepository.findAll(pageable);

        var userResponses = pageData.getContent().stream()
                .map(userMapper::toUserResponse)
                .toList();

        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(pageData.getSize())
                .totalElements(pageData.getTotalElements())
                .data(userResponses)
                .build();
    }

    @Transactional(readOnly = true)
    @PostAuthorize("hasRole('admin') or returnObject.email == authentication.name")
    public UserResponse getUser(String id)
    {
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public PageResponse<UserResponse> getAllCustomers(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);

        Page<User> pageData = userRepository.findByBranchIdIsNull(pageable);

        var userResponses = pageData.getContent().stream()
                .map(userMapper::toUserResponse)
                .toList();

        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(userResponses)
                .build();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public PageResponse<UserResponse> getAllEmployees(int page, int size) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> pageData;

        if (isAdmin) {
            pageData = userRepository.findByBranchIdIsNotNull(pageable);
        } else {
            if (auth instanceof JwtAuthenticationToken jwtToken) {
                String tokenBranchId = (String) jwtToken.getTokenAttributes().get("branchId");
                pageData = userRepository.findByBranchId(tokenBranchId, pageable);
            } else {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        var userResponses = pageData.getContent().stream()
                .map(userMapper::toUserResponse)
                .toList();

        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(userResponses)
                .build();
    }


    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UserResponse updateUser(String id, UserUpdateRequest request)
    {
        User user = userRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a-> a.getAuthority().equals("ROLE_admin"));

        if(!isAdmin && !user.getEmail().equals(auth.getName()))
        {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

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
                if(!isAdmin)
                {
                    throw new AppException(ErrorCode.UNAUTHORIZED);
                }
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

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public void deleteUser(String id)
    {
        if(!userRepository.existsById(id))
        {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public UserResponse getMyInfo()
    {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    //FILTER
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> filterUsers(String keyword, Boolean isActive, String branchId,
                                                  String roleName, int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size);
        Specification<User> specification = UserSpecification.filterUsers(keyword, isActive, branchId, roleName);

        Page<User> pageData = userRepository.findAll(specification, pageable);

        var userResponses = pageData.getContent().stream()
                .map(userMapper::toUserResponse)
                .toList();

        return  PageResponse.<UserResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(userResponses)
                .build();
    }
}
