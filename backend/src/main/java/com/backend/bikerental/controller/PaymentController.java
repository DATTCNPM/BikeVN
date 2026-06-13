package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.PaymentCreationRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.PaymentResponse;
import com.backend.bikerental.service.PaymentServiceP;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentServiceP paymentService;
    // CREATE PAYMENT (QR)
    @PostMapping
    public ApiResponse<PaymentResponse> createPayment(@RequestBody PaymentCreationRequest request) {
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.createPayment(request))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<PaymentResponse>> getAllPayments(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
            )
    {
        return ApiResponse.<PageResponse<PaymentResponse>>builder()
                .result(paymentService.getAllPayments(page,size))
                .build();
    }

    @GetMapping("/my-branch")
    public ApiResponse<PageResponse<PaymentResponse>> getAllPaymentPerBranch(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    )
    {
        return ApiResponse.<PageResponse<PaymentResponse>>builder()
                .result(paymentService.getAllPaymentPerBranch(page, size))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<PaymentResponse> getPayment(@PathVariable String id) {
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.getPayment(id))
                .build();
    }
    // CONFIRM PAYMENT (giả lập bank)
    @PostMapping("/{id}/confirm")
    public ApiResponse<Void> confirmPayment(
            @PathVariable String id,
            @RequestParam String transactionCode
    ) {
        paymentService.confirmPayment(id, transactionCode);
        return ApiResponse.<Void>builder()
                .message("Confirm!!!")
                .build();
    }

    @PostMapping("/{id}/approve-manually")
    public ApiResponse<PaymentResponse> approvePaymentManually(
            @PathVariable String id,
            @RequestParam String adminId, // ID của nhân viên đang thao tác
            @RequestParam String actualPaymentMethod // VD: "cash", "pos", "transfer"
    ) {
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.approvePaymentManually(id, adminId, actualPaymentMethod))
                .build();
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<PaymentResponse> cancelPayment(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "User canceled") String reason
    ) {
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.cancelPayment(id, reason))
                .build();
    }
}

