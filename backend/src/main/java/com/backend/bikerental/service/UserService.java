package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.UserCreationRequest;
import com.backend.bikerental.dto.response.UserResponse;
import com.backend.bikerental.entity.User;
import com.backend.bikerental.mapper.UserMapper;
import com.backend.bikerental.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    public UserResponse createUser(UserCreationRequest request)
    {
        if(userRepository.existsByEmail(request.getEmail()))
        {
            throw new RuntimeException("user existed");
        }
        User user = userMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
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
