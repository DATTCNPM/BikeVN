package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.BranchCreationRequest;
import com.backend.bikerental.dto.request.BranchUpdateRequest;
import com.backend.bikerental.dto.response.BranchResponse;
import com.backend.bikerental.entity.Branch;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.BranchMapper;
import com.backend.bikerental.repository.BranchRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BranchService {
    BranchRepository branchRepository;
    BranchMapper branchMapper;

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public BranchResponse createBranch(BranchCreationRequest request)
    {
        if(branchRepository.existsByName(request.getName()))
        {
            throw new AppException(ErrorCode.BRANCH_EXISTED);
        }
        Branch branch = branchMapper.toBranch(request);
        return branchMapper.toBranchResponse(branchRepository.save(branch));
    }

    @Transactional(readOnly = true)
    public BranchResponse getBranch(String id) {
        return branchMapper.toBranchResponse(branchRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BRANCH_NOT_EXISTED)));
    }

    @Transactional(readOnly = true)
    public List<BranchResponse> getAllBranches() {
        return branchMapper.toListBranchResponse(branchRepository.findAll());
    }

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public BranchResponse updateBranch(String id, BranchUpdateRequest request)
    {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        branchMapper.updateBranch(branch, request);
        return branchMapper.toBranchResponse(branchRepository.save(branch));
    }

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public void deleteBranch(String id)
    {
        if (!branchRepository.existsById(id)) {
            throw new AppException(ErrorCode.BRANCH_NOT_EXISTED);
        }
        branchRepository.deleteById(id);
    }
}
