package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.UserCreationRequest;
import com.backend.bikerental.dto.response.UserResponse;
import com.backend.bikerental.entity.Role;
import com.backend.bikerental.entity.User;
import com.backend.bikerental.enums.RoleEnum;
import com.backend.bikerental.mapper.UserMapper;
import com.backend.bikerental.repository.RoleRepository;
import com.backend.bikerental.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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
    public UserResponse createUser(UserCreationRequest request)
    {
        if(userRepository.existsByEmail(request.getEmail()))
        {
            throw new RuntimeException("user existed");
        }
        User user = userMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

        var role = roleRepository.findById(RoleEnum.user.name())
                .orElseGet(()-> {
                    var newRole = Role.builder()
                            .name(RoleEnum.user.name())
                            .description("User role")
                            .build();
                    return roleRepository.save(newRole);
                });
        user.setRoles(Set.of(role));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers()
    {
        return userMapper.toListUsersResponse(userRepository.findAll());
    }

    public UserResponse getUser(String id)
    {
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("user is not exist")));
    }

    public void deleteUser(String id)
    {
        userRepository.deleteById(id);
    }

}
