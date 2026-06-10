package com.backend.bikerental.component;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
public class PricingCalculator {

    // Record chứa 2 kết quả trả về: Tổng tiền và Chi tiết hóa đơn
    public record ExtraFeeResult(BigDecimal totalFee, String invoiceDetails) {}

    /**
     * Tính toán tổng tiền thuê xe
     */
    public BigDecimal calculateBookingPrice(LocalDateTime startTime, LocalDateTime endTime, BigDecimal pricePerDay) {
        long hours = Duration.between(startTime, endTime).toHours();
        if (hours <= 0) hours = 1;
        long days = (long) Math.ceil((double) hours / 24);
        if (days <= 0) days = 1;
        return pricePerDay.multiply(BigDecimal.valueOf(days));
    }

    /**
     * Khắc phục lỗi Null cho phụ phí gửi lên từ Request
     */
    public BigDecimal calculateExtraFee(BigDecimal requestedFee) {
        return requestedFee != null ? requestedFee : BigDecimal.ZERO;
    }

    /**
     * Hàm cộng chuỗi ghi chú an toàn
     */
    public String appendInvoiceNote(String currentNotes, String invoiceDetails) {
        if (invoiceDetails == null || invoiceDetails.isBlank()) {
            return currentNotes;
        }
        if (currentNotes != null && !currentNotes.trim().isEmpty()) {
            return currentNotes + " | " + invoiceDetails;
        } else {
            return invoiceDetails;
        }
    }

    /**
     * Tính toán tổng phụ phí (Trả trễ, Hư hỏng, Sai chi nhánh)
     */
    public ExtraFeeResult calculateTotalExtraFee(
            String expectedReturnBranchId,
            String actualReturnBranchId,
            BigDecimal damageFee,
            LocalDateTime expectedEndTime,
            LocalDateTime actualReturnTime) {

        BigDecimal totalExtraFee = BigDecimal.ZERO;
        StringBuilder feeDetailsBuilder = new StringBuilder("Surcharge details: ");
        boolean hasFee = false;

        // WRONG BRANCH
        if (expectedReturnBranchId != null && !expectedReturnBranchId.equals(actualReturnBranchId)) {
            totalExtraFee = totalExtraFee.add(BigDecimal.valueOf(50000));
            feeDetailsBuilder.append("Wrong Branch: 50,000 VND | ");
            hasFee = true;
        }

        // DAMAGE FEE
        if (damageFee != null && damageFee.compareTo(BigDecimal.ZERO) > 0) {
            totalExtraFee = totalExtraFee.add(damageFee);
            feeDetailsBuilder.append("Damage Fee: ").append(damageFee).append(" VND | ");
            hasFee = true;
        }

        // LATE RETURN
        if (actualReturnTime.isAfter(expectedEndTime)) {
            long lateHours = ChronoUnit.HOURS.between(expectedEndTime, actualReturnTime);
            long lateDays = (lateHours / 24) + (lateHours % 24 > 0 ? 1 : 0);

            if (lateDays > 0) {
                BigDecimal lateFee = BigDecimal.valueOf(lateDays * 250000L);
                totalExtraFee = totalExtraFee.add(lateFee);
                feeDetailsBuilder.append("Late Fee (").append(lateDays).append(" days): ").append(lateFee).append(" VND | ");
                hasFee = true;
            }
        }

        String finalDetails = hasFee ? feeDetailsBuilder.toString() : "";
        if (finalDetails.endsWith(" | ")) {
            finalDetails = finalDetails.substring(0, finalDetails.length() - 3);
        }

        return new ExtraFeeResult(totalExtraFee, finalDetails);
    }
}