package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.PaymentCreationRequest;
import com.backend.bikerental.dto.response.ApiResponse;
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
}

