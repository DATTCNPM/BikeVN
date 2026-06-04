package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.PaymentCreationRequest;
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
    public PaymentResponse createPayment(@RequestBody PaymentCreationRequest request) {
        return paymentService.createPayment(request);
    }
    @GetMapping("/{id}")
    public PaymentResponse getPayment(@PathVariable String id) {
        return paymentService.getPayment(id);
    }
    // CONFIRM PAYMENT (giả lập bank)
    @PostMapping("/{id}/confirm")
    public void confirmPayment(
            @PathVariable String id,
            @RequestParam String transactionCode
    ) {
        paymentService.confirmPayment(id, transactionCode);
    }
}

