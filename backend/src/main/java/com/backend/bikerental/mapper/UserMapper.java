package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.UserCreationRequest;
import com.backend.bikerental.dto.request.UserUpdateRequest;
import com.backend.bikerental.dto.response.UserResponse;
import com.backend.bikerental.entity.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "branch", ignore = true)
    User toUser(UserCreationRequest request);

    @Mapping(source = "branch.id", target = "branchId")
    UserResponse toUserResponse(User user);
    List<UserResponse> toListUsersResponse(List<User> users);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "branch", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
