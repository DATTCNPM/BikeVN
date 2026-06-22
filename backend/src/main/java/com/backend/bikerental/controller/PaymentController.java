package com.backend.bikerental.controller;

import com.backend.bikerental.dto.request.PaymentCreationRequest;
import com.backend.bikerental.dto.response.ApiResponse;
import com.backend.bikerental.dto.response.PageResponse;
import com.backend.bikerental.dto.response.PaymentResponse;
import com.backend.bikerental.enums.PaymentStatus;
import com.backend.bikerental.enums.PaymentType;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.service.PaymentServiceP;
import com.backend.bikerental.service.VNPayService;
import com.backend.bikerental.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
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

        String responseCode = queryParams.get("vnp_ResponseCode");
        // The response code "00" represents a completely successful transaction.
        if ("00".equals(responseCode)) {
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

    @GetMapping("/vnpay-ipn")
    public Map<String, String> vnpayIpnCallback(@RequestParam Map<String, String> queryParams) {
        Map<String, String> result = new HashMap<>();

        try {
            // 1. Kiểm tra chữ ký bảo mật
            if (!vnPayService.verifyCallback(queryParams)) {
                result.put("RspCode", "97");
                result.put("Message", "Invalid Checksum");
                return result;
            }

            String paymentId = queryParams.get("vnp_TxnRef");
            String responseCode = queryParams.get("vnp_ResponseCode");
            String transactionCode = queryParams.get("vnp_TransactionNo");

            // Ép kiểu số tiền VNPay trả về (VNPay nhân 100 lần, nên ta phải chia 100 để so sánh)
            long vnpAmount = Long.parseLong(queryParams.get("vnp_Amount")) / 100;

            // 2. GỌI XUỐNG SERVICE ĐỂ KIỂM TRA LẠI DỮ LIỆU VÀ CẬP NHẬT (Xem bước 3 bên dưới)
            // Lệnh này sẽ throw Exception nếu paymentId sai, số tiền sai, hoặc đã update rồi
            paymentService.processIpnPayment(paymentId, vnpAmount, responseCode, transactionCode);

            // Báo cho VNPay biết: Tao nhận tiền và update DB xong rồi, đừng gọi lại nữa!
            result.put("RspCode", "00");
            result.put("Message", "Confirm Success");

        } catch (AppException e) {
            // Xử lý các lỗi nghiệp vụ từ Service ném lên theo chuẩn IPN VNPay
            if (e.getErrorCode() == ErrorCode.PAYMENT_NOT_FOUND) {
                result.put("RspCode", "01");
                result.put("Message", "Order not found");
            } else if (e.getErrorCode() == ErrorCode.PAYMENT_ALREADY_COMPLETED) { // Cần tạo thêm mã lỗi này
                result.put("RspCode", "02");
                result.put("Message", "Order already confirmed");
            } else if (e.getErrorCode() == ErrorCode.INVALID_AMOUNT) { // Cần tạo thêm mã lỗi này
                result.put("RspCode", "04");
                result.put("Message", "Invalid amount");
            } else {
                result.put("RspCode", "99");
                result.put("Message", "Unknown error");
            }
        } catch (Exception e) {
            result.put("RspCode", "99");
            result.put("Message", "Unknown error");
        }

        return result;
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

    @GetMapping("/admin/filter")
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public ApiResponse<PageResponse<PaymentResponse>> filterPayments(
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String transactionCode,
            @RequestParam(required = false) String branchId,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        if (!isAdmin && auth instanceof JwtAuthenticationToken jwtToken) {
            branchId = (String) jwtToken.getTokenAttributes().get("branchId");
        }

        return ApiResponse.<PageResponse<PaymentResponse>>builder()
                .result(paymentService.filterPayments(
                        bookingId, transactionCode, branchId, status, type, fromDate, toDate, page, size
                ))
                .build();
    }
}

