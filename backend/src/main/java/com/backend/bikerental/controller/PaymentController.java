package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.PaymentCreationRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.PaymentResponse;
import com.backend.bikerental.enums.PaymentStatus;
import com.backend.bikerental.service.PaymentServiceP;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping()
    public ApiResponse<Page<PaymentResponse>> getAllPayments(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(defaultValue = "0") int page, //mac dinh trang 0
            @RequestParam(defaultValue = "10") int size //mac dinh 10pt/1 trang
            )
    {
        //yeu cau lay trang, so luong pt/trang, sap xep theo thoi gian tao giam dan
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return ApiResponse.<Page<PaymentResponse>>builder()
                .result(paymentService.getAllPayments(status, pageable))
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

