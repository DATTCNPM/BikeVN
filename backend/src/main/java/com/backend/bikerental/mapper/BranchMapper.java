package com.backend.bikerental.mapper;

import com.backend.bikerental.dto.request.BranchCreationRequest;
import com.backend.bikerental.dto.request.BranchUpdateRequest;
import com.backend.bikerental.dto.request.UserCreationRequest;
import com.backend.bikerental.dto.request.UserUpdateRequest;
import com.backend.bikerental.dto.response.BranchResponse;
import com.backend.bikerental.dto.response.UserResponse;
import com.backend.bikerental.entity.Branch;
import com.backend.bikerental.entity.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BranchMapper {
    @Mapping(target = "id", ignore = true)
    Branch toBranch(BranchCreationRequest request);
    BranchResponse toBranchResponse(Branch branch);
    List<BranchResponse> toListBranchResponse(List<Branch> branches);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBranch(@MappingTarget Branch branch, BranchUpdateRequest request);
}
