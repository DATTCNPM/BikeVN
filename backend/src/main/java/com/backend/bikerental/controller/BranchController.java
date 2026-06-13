package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.BranchCreationRequest;
import com.backend.bikerental.dto.request.BranchUpdateRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.BranchResponse;
import com.backend.bikerental.service.BranchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/branches")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BranchController {
    BranchService branchService;

    @PostMapping
    ApiResponse<BranchResponse> createBranch(@RequestBody BranchCreationRequest request)
    {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.createBranch(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<BranchResponse>> getAllBranches()
    {
        return ApiResponse.<List<BranchResponse>>builder()
                .result(branchService.getAllBranches())
                .build();
    }

    @GetMapping("/{branchId}")
    ApiResponse<BranchResponse> getBranch(@PathVariable("branchId") String id)
    {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.getBranch(id))
                .build();
    }

    @PutMapping("/{branchId}")
    ApiResponse<BranchResponse> updateBranch(@PathVariable("branchId") String id, @RequestBody BranchUpdateRequest request)
    {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.updateBranch(id, request))
                .build();
    }

    @DeleteMapping("/{branchId}")
    ApiResponse<Void> deleteVehicle(@PathVariable("branchId") String id)
    {
        branchService.deleteBranch(id);
        return ApiResponse.<Void>builder()
                .message("Branch deleted")
                .build();
    }
}
