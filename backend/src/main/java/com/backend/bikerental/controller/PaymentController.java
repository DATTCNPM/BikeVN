package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.PaymentCreationRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.PaymentResponse;
import com.backend.bikerental.service.PaymentServiceP;
import com.backend.bikerental.service.VNPayService;
import com.backend.bikerental.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentServiceP paymentService;
    VNPayService vnPayService;
    // CREATE PAYMENT (QR)
    @PostMapping
    public ApiResponse<PaymentResponse> createPayment(@RequestBody PaymentCreationRequest request) {
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.createPayment(request))
                .build();
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    @GetMapping("/{paymentId}/vnpay-url")
    public ApiResponse<String> getVNPayUrl(@PathVariable String paymentId, HttpServletRequest request) {
        PaymentResponse payment = paymentService.getPayment(paymentId);
        String ipAddress = VNPayUtil.getIpAddress(request);

        if (ipAddress.equals("0:0:0:0:0:0:0:1")) {
            ipAddress = "127.0.0.1";
        }

        // Convert money from Double/BigDecimal to long type
        long amount = (long) payment.getAmount().doubleValue();
        String paymentUrl = vnPayService.createPaymentUrl(paymentId, amount, ipAddress);

        return ApiResponse.<String>builder()
                .result(paymentUrl)
                .build();
    }


    //2. VNPAY will redirect the product review process here after payment is completed.
    @GetMapping("/vnpay-return")
    public ApiResponse<String> vnpayReturnCallback(@RequestParam Map<String, String> queryParams) {

        // Kiểm tra tính hợp lệ của chữ ký bảo mật từ VNPay gửi về
        if (!vnPayService.verifyCallback(queryParams)) {
            return ApiResponse.<String>builder()
                    .code(9999)
                    .message("Invalid security signature")
                    .build();
        }

        String paymentId = queryParams.get("vnp_TxnRef");
        String responseCode = queryParams.get("vnp_ResponseCode");
        String transactionCode = queryParams.get("vnp_TransactionNo");

        // The response code "00" represents a completely successful transaction.
        if ("00".equals(responseCode)) {
            paymentService.confirmPayment(paymentId, transactionCode);
            return ApiResponse.<String>builder()
                    .message("Order payment via VNPay successful")
                    .result("SUCCESS")
                    .build();
        } else {
            return ApiResponse.<String>builder()
                    .code(400)
                    .message("Transaction failed. Error code from VNPay: " + responseCode)
                    .result("FAILED")
                    .build();
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
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
//    @PostMapping("/{id}/confirm")
//    public ApiResponse<Void> confirmPayment(
//            @PathVariable String id,
//            @RequestParam String transactionCode
//    ) {
//        paymentService.confirmPayment(id, transactionCode);
//        return ApiResponse.<Void>builder()
//                .message("Confirm!!!")
//                .build();
//    }

    @PostMapping("/{id}/approve-manually")
    public ApiResponse<PaymentResponse> approvePaymentManually(
            @PathVariable String id,
            @RequestParam String adminId,
            @RequestParam String actualPaymentMethod
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

