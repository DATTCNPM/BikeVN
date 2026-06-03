package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.BookingCreationRequest;
import com.backend.bikerental.dto.response.BookingResponse;
import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.enums.BookingStatus;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.BookingMapper;
import com.backend.bikerental.repository.BookingRepository;
import com.backend.bikerental.repository.UserRepository;
import com.backend.bikerental.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService {
    BookingRepository bookingRepository;
    BookingMapper bookingMapper;
    UserRepository userRepository;
    VehicleRepository vehicleRepository;
    @Transactional
    public BookingResponse createBooking(BookingCreationRequest request)
    {
        validateRequest(request);
        validateExistence(request);
        checkConflict(request);
        Booking booking = bookingMapper.toBooking(request);
        enrichBooking(booking, request);
        return bookingMapper.toBookingResponse(bookingRepository.save(booking));
    }
    private void validateRequest(BookingCreationRequest request)
    {
        if(request.getStartTime().isAfter(request.getEndTime()))
        {
            throw new RuntimeException("Start time must be before end time");
        }
        if(request.getStartTime().isBefore(LocalDateTime.now()))
        {
            throw new RuntimeException("Start time must be in the future");
        }
    }
    private void validateExistence(BookingCreationRequest request)
    {
        if(!userRepository.existsById(request.getUserId()))
        {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        if(!vehicleRepository.existsById(request.getVehicleId()))
        {
            throw new AppException(ErrorCode.VEHICLE_NOT_EXISTED);
        }
        Booking booking = bookingMapper.toBooking(request);
        if(!bookingRepository.existsById(request.getPickupBranchId()) ||
                !bookingRepository.existsById(request.getReturnBranchId()))
        {
            throw new AppException(ErrorCode.BRANCH_NOT_EXISTED);
        }
    }
    private void checkConflict(BookingCreationRequest request)
    {
        boolean conflict = bookingRepository
                .existsByVehicleIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                        request.getVehicleId(),
                        List.of(BookingStatus.pending, BookingStatus.approved),
                        request.getStartTime(),
                        request.getEndTime()
                );
        if (conflict)
        {
            throw new RuntimeException("Vehicle already booked in this time range");
        }
    }
    private void enrichBooking(Booking booking,BookingCreationRequest request)
    {
        booking.setStatus(BookingStatus.pending);
        booking.setTotalPrice(calculatePrice(request));
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
    }
    //calculate simulator(***)
    private BigDecimal calculatePrice(BookingCreationRequest request)
    {
        long hours = Duration.between(request.getStartTime(), request.getEndTime()).toHours();
        if(hours <= 0)
        {
            hours = 1;
        }
        return BigDecimal.valueOf(hours * 100_000);
    }
}
