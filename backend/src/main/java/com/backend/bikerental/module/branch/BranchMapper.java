package com.backend.bikerental.module.branch;

import com.backend.bikerental.module.branch.dto.BranchCreationRequest;
import com.backend.bikerental.module.branch.dto.BranchResponse;
import com.backend.bikerental.module.branch.dto.BranchUpdateRequest;
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
