package com.backend.bikerental.module.user;

import com.backend.bikerental.module.user.dto.UserCreationRequest;
import com.backend.bikerental.module.user.dto.UserResponse;
import com.backend.bikerental.module.user.dto.UserUpdateRequest;
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
