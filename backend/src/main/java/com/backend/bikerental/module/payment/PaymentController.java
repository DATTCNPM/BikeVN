package com.backend.bikerental.module.payment;

import com.backend.bikerental.module.payment.dto.PaymentCreationRequest;
import com.backend.bikerental.core.dto.ApiResponse;
import com.backend.bikerental.core.dto.PageResponse;
import com.backend.bikerental.module.payment.dto.PaymentResponse;
import com.backend.bikerental.module.payment.enums.PaymentStatus;
import com.backend.bikerental.module.payment.enums.PaymentType;
import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
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
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentService paymentService;
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
    public ApiResponse<String> vnpayReturnCallback(HttpServletRequest request) {

        Map<String, String> fields = new HashMap<>();

        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                fields.put(fieldName, fieldValue);
            }
        }
        // Kiểm tra tính hợp lệ của chữ ký bảo mật từ VNPay gửi về
        if (!vnPayService.verifyCallback(fields)) {
            return ApiResponse.<String>builder()
                    .code(9999)
                    .message("Invalid security signature")
                    .build();
        }

        String responseCode = fields.get("vnp_ResponseCode");
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
    public Map<String, String> vnpayIpnCallback(HttpServletRequest request) { // Dùng HttpServletRequest
        Map<String, String> result = new HashMap<>();

        try {
            // Hứng dữ liệu thô chống lỗi khoảng trắng
            Map<String, String> fields = new HashMap<>();
            for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if (fieldValue != null && fieldValue.length() > 0) {
                    fields.put(fieldName, fieldValue);
                }
            }

            System.out.println("\n====== VNPay IPN GOI VE ======");
            System.out.println("Payment ID: " + fields.get("vnp_TxnRef"));
            System.out.println("Response Code: " + fields.get("vnp_ResponseCode"));

            if (!vnPayService.verifyCallback(fields)) {
                result.put("RspCode", "97");
                result.put("Message", "Invalid Checksum");
                return result;
            }

            String paymentId = fields.get("vnp_TxnRef");
            String responseCode = fields.get("vnp_ResponseCode");
            String transactionCode = fields.get("vnp_TransactionNo");
            long vnpAmount = Long.parseLong(fields.get("vnp_Amount")) / 100;

            paymentService.processIpnPayment(paymentId, vnpAmount, responseCode, transactionCode);

            result.put("RspCode", "00");
            result.put("Message", "Confirm Success");

        } catch (AppException e) {
            if (e.getErrorCode() == ErrorCode.PAYMENT_NOT_FOUND) {
                result.put("RspCode", "01"); result.put("Message", "Order not found");
            } else if (e.getErrorCode() == ErrorCode.PAYMENT_ALREADY_COMPLETED) {
                result.put("RspCode", "02"); result.put("Message", "Order already confirmed");
            } else if (e.getErrorCode() == ErrorCode.INVALID_AMOUNT) {
                result.put("RspCode", "04"); result.put("Message", "Invalid amount");
            } else {
                result.put("RspCode", "99"); result.put("Message", "Unknown error");
            }
        } catch (Exception e) {
            result.put("RspCode", "99");
            result.put("Message", "Unknown error");
        }

        return result;
    }

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

    @PostMapping("/{id}/refund")
    @PreAuthorize("hasRole('admin')")
    public ApiResponse<PaymentResponse> processRefund(
            @PathVariable String id,
            @RequestParam String adminId,
            HttpServletRequest request
    ) {
        String ipAddress = VNPayUtil.getIpAddress(request);
        if (ipAddress.equals("0:0:0:0:0:0:0:1")) {
            ipAddress = "127.0.0.1";
        }
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.processRefund(id, adminId, ipAddress))
                .build();
    }
}

