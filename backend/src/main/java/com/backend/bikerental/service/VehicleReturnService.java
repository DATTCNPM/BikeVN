package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.VehicleReturnRequest;
import com.backend.bikerental.dto.response.PaymentResponse;
import com.backend.bikerental.dto.response.VehicleReturnResponse;
import com.backend.bikerental.entity.VehicleReturn;
import com.backend.bikerental.mapper.VehicleReturnMapper;
import com.backend.bikerental.repository.PaymentRepository;
import com.backend.bikerental.repository.VehicleReturnRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleReturnService {
    VehicleReturnRepository vehicleReturnRepository;
    VehicleReturnMapper vehicleReturnMapper;
    FileStorageService fileStorageService;
    PaymentServiceP paymentServiceP;
    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public VehicleReturnResponse createReturn(VehicleReturnRequest request)
    {
        if(vehicleReturnRepository.existsByBookingId(request.getBookingId()))
        {
            throw new RuntimeException("Booking ID " + request.getBookingId() + " has already been returned!");
        }

        VehicleReturn vehicleReturn = vehicleReturnMapper.toVehicleReturn(request);

        if(vehicleReturn.getExtraFee() == null)
        {
            vehicleReturn.setExtraFee(BigDecimal.ZERO);
        }

        List<String> imagesUrl = fileStorageService.storeVehicleReturnImages(request.getImages());
        vehicleReturn.setImages(imagesUrl);

        BigDecimal extraFee = request.getExtraFee() != null ? request.getExtraFee() : BigDecimal.ZERO;
        PaymentResponse paymentResponse = paymentServiceP.createExtraFeePayment(
                request.getBookingId(),
                extraFee,
                request.getReturnBranchId()
        );

        if (paymentResponse != null) {
            // Nếu có Payment sinh ra, cập nhật extraFee bằng tổng số tiền (Damage + Late)
            vehicleReturn.setExtraFee(paymentResponse.getAmount());
        } else {
            // Nếu paymentResponse == null (Khách trả đúng giờ, không xước xe)
            vehicleReturn.setExtraFee(BigDecimal.ZERO);
        }

        return vehicleReturnMapper.toVehicleReturnResponse(vehicleReturnRepository.save(vehicleReturn));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public VehicleReturnResponse getReturnByBookingId(String bookingId)
    {
        VehicleReturn vehicleReturn = vehicleReturnRepository.findByBookingId(bookingId)
                .orElseThrow(()-> new RuntimeException("return not found"));
        return vehicleReturnMapper.toVehicleReturnResponse(vehicleReturn);
    }
}
