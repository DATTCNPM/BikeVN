package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.UserCreationRequest;
import com.backend.bikerental.dto.response.UserResponse;
import com.backend.bikerental.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);
    List<UserResponse> toListUsersResponse(List<User> users);
}
