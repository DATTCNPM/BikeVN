package com.backend.bikerental.service;

import com.backend.bikerental.component.PricingCalculator;
import com.backend.bikerental.dto.request.VehicleReturnRequest;
import com.backend.bikerental.dto.response.PaymentResponse;
import com.backend.bikerental.dto.response.VehicleReturnResponse;
import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.entity.Branch;
import com.backend.bikerental.entity.Vehicle;
import com.backend.bikerental.entity.VehicleReturn;
import com.backend.bikerental.enums.StatusVehicleEnum;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.VehicleReturnMapper;
import com.backend.bikerental.repository.*;
import com.backend.bikerental.util.BranchSecurityUtil;
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
    PaymentServiceP paymentService;
    BranchSecurityUtil branchSecurityUtil;
    PricingCalculator pricingCalculator;
    BookingRepository bookingRepository;
    BranchRepository branchRepository;
    VehicleRepository vehicleRepository;
    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public VehicleReturnResponse createReturn(VehicleReturnRequest request)
    {
        branchSecurityUtil.verifyBranchAccess(request.getReturnBranchId());

        if(vehicleReturnRepository.existsByBookingId(request.getBookingId()))
        {
            throw new AppException(ErrorCode.RETURN_ALREADY_EXISTS);
        }

        VehicleReturn vehicleReturn = vehicleReturnMapper.toVehicleReturn(request);

        List<String> imagesUrl = fileStorageService.storeVehicleReturnImages(request.getImages());
        vehicleReturn.setImages(imagesUrl);

        BigDecimal damageFee = pricingCalculator.calculateExtraFee(request.getExtraFee());

        PaymentResponse paymentResponse = paymentService.createExtraFeePayment(
                request.getBookingId(),
                damageFee,
                request.getReturnBranchId()
        );

        if(paymentResponse != null)
        {
            vehicleReturn.setExtraFee(paymentResponse.getAmount());

            vehicleReturn.setNotes(pricingCalculator.appendInvoiceNote(
                    vehicleReturn.getNotes(),
                    paymentResponse.getTransferContent()
            ));
        }
        else {
            vehicleReturn.setExtraFee(BigDecimal.ZERO);
        }

        updateVehicleAfterReturn(request.getBookingId(), request.getReturnBranchId());

        return vehicleReturnMapper.toVehicleReturnResponse(vehicleReturnRepository.save(vehicleReturn));
    }

    private void updateVehicleAfterReturn(String bookingId, String returnBranchId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        Vehicle vehicle = vehicleRepository.findById(booking.getVehicleId())
                .orElseThrow(() -> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        Branch returnBranch = branchRepository.findById(returnBranchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));

        vehicle.setStatus(StatusVehicleEnum.available);
        vehicle.setCurrentBranch(returnBranch);

        vehicleRepository.save(vehicle);
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
