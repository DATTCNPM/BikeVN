package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.UserCreationRequest;
import com.backend.bikerental.dto.response.UserResponse;
import com.backend.bikerental.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);
    List<UserResponse> toListUsersResponse(List<User> users);
}
