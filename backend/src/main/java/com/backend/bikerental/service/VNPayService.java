package com.backend.bikerental.service;

import com.backend.bikerental.util.VNPayUtil;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VNPayService {
    @Value("${vnpay.tmn-code}")
    String tmnCode;
    @Value("${vnpay.hash-secret}")
    String hashSecret;
    @Value("${vnpay.pay-url}")
    String payUrl;
    @Value("${vnpay.return-url}")
    String returnUrl;

    public String createPaymentUrl(String paymentId, long amountInVnd, String ipAddress) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderType = "other";
        long amount = amountInVnd * 100;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", tmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", paymentId);

        vnp_Params.put("vnp_OrderInfo", "Pay for the order " + paymentId);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", ipAddress);

        ZoneId zoneId = ZoneId.of("Asia/Ho_Chi_Minh");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        ZonedDateTime now = ZonedDateTime.now(zoneId);
        vnp_Params.put("vnp_CreateDate", now.format(formatter));
        vnp_Params.put("vnp_ExpireDate", now.plusMinutes(15).format(formatter));

        //Sort the parameters alphabetically
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        try {
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);

                //PROTECTION 3: Only include in the hash string if it has a value
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    //Data hash structure
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    //query URL structure
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayUtil.hmacSHA512(hashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        //Print to console for debugging and error
        System.out.println("====== VNPAY DEBUG ======");
        System.out.println("HashData hash: " + hashData.toString());
        System.out.println("Secret Chain: " + hashSecret);

        return payUrl + "?" + queryUrl;
    }
    public boolean verifyCallback(Map<String, String> fields) {
        String vnp_SecureHash = fields.get("vnp_SecureHash");

        //Remove signature fields from hash data
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        //Sort the parameters
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        try {
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = String.valueOf(fields.get(fieldName));

                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    //FIX ERROR: RE-ENCODE USING US_ASCII BEFORE HASHING THE HASH
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String checkSum = VNPayUtil.hmacSHA512(hashSecret, hashData.toString());
        return checkSum.equalsIgnoreCase(vnp_SecureHash);
    }
}