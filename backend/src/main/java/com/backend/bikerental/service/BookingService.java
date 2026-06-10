package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.BookingCreationRequest;
import com.backend.bikerental.dto.response.BookingResponse;
import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.entity.Vehicle;
import com.backend.bikerental.enums.BookingStatus;
import com.backend.bikerental.enums.PaymentStatus;
import com.backend.bikerental.enums.StatusVehicleEnum;
import com.backend.bikerental.enums.VehicleType;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.mapper.BookingMapper;
import com.backend.bikerental.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    BranchRepository branchRepository;
    BookingLockService bookingLockService;
    PaymentRepository paymentRepository;
    private static final int EXPIRE_MINUTES = 10;

    @Transactional
    public BookingResponse createBooking(BookingCreationRequest request) {

        validateRequest(request);
        validateExistence(request);

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        if(!vehicle.getStatus().equals(StatusVehicleEnum.available))
        {
            throw new AppException(ErrorCode.VEHICLE_NOT_AVAILABLE);
        }

        if (bookingRepository.existsApprovedBooking(request.getVehicleId(),
                request.getStartTime(),
                request.getEndTime()))
        {
            throw new AppException(ErrorCode.VEHICLE_ALREADY_LOCKED);
        }

        bookingRepository.findFirstByUserIdAndStatus(request.getUserId(), BookingStatus.pending)
                .ifPresent(old -> {
                    old.setStatus(BookingStatus.cancelled);
                    old.setUpdatedAt(LocalDateTime.now());
                    bookingRepository.save(old);
                    bookingLockService.releaseLockByVehicleAndUser(request.getVehicleId(), request.getUserId());
                });
        //create soft lock
        bookingLockService.createLock(request.getVehicleId(), request.getUserId(),
                request.getStartTime(), request.getEndTime(), EXPIRE_MINUTES);

        Booking booking = bookingMapper.toBooking(request);
        enrichBooking(booking, request, vehicle);

        return bookingMapper.toBookingResponse(bookingRepository.save(booking)
        );
    }
    public BookingResponse getBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        return bookingMapper.toBookingResponse(booking);
    }
    public List<BookingResponse> getAllBooking()
    {
        return bookingMapper.toListBookingResponse(bookingRepository.findAll());
    }
    public List<BookingResponse> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(bookingMapper::toBookingResponse)
                .toList();
    }
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void cancelBooking(String id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (booking.getStatus() == BookingStatus.completed) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_COMPLETED);
        }
        booking.setStatus(BookingStatus.cancelled);
        booking.setUpdatedAt(LocalDateTime.now());

        bookingRepository.save(booking);
    }
    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public void approveBooking(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        booking.setStatus(BookingStatus.approved);
        booking.setUpdatedAt(LocalDateTime.now());

        bookingRepository.save(booking);
    }
    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public void rejectBooking(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        booking.setStatus(BookingStatus.rejected);
        booking.setUpdatedAt(LocalDateTime.now());

        bookingRepository.save(booking);
    }
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireBookings() {

        List<Booking> bookings = bookingRepository.findByStatus(BookingStatus.pending);
        LocalDateTime now = LocalDateTime.now();

        for (Booking b : bookings) {
            if (b.getExpiresAt() != null && b.getExpiresAt().isBefore(now)) {
                b.setStatus(BookingStatus.cancelled);
                b.setUpdatedAt(now);

                bookingLockService.releaseLockByVehicleAndUser(b.getVehicleId(), b.getUserId());
                paymentRepository.findFirstByBookingIdAndStatus(b.getId(), PaymentStatus.pending)
                        .ifPresent(payment -> {
                            payment.setStatus(PaymentStatus.failed);
                            payment.setUpdatedAt(now);
                            paymentRepository.save(payment);
                        });
            }
        }

        bookingRepository.saveAll(bookings);
    }
    private void validateRequest(BookingCreationRequest request) {

        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new AppException(ErrorCode.INVALID_TIME);
        }

        if (request.getStartTime().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_TIME);
        }
    }

    private void validateExistence(BookingCreationRequest request) {

        if (!userRepository.existsById(request.getUserId())) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        if (!branchRepository.existsById(request.getPickupBranchId())
                || !branchRepository.existsById(request.getReturnBranchId())) {
            throw new AppException(ErrorCode.BRANCH_NOT_EXISTED);
        }
    }
    private void enrichBooking(Booking booking, BookingCreationRequest request, Vehicle vehicle) {

        LocalDateTime now = LocalDateTime.now();

        booking.setStatus(BookingStatus.pending);
        booking.setTotalPrice(calculatePrice(request, vehicle));
        booking.setCreatedAt(now);
        booking.setUpdatedAt(now);
        booking.setExpiresAt(now.plusMinutes(EXPIRE_MINUTES));// set time expire
    }
    private BigDecimal calculatePrice(BookingCreationRequest request, Vehicle vehicle) {

        long hours = Duration.between(
                request.getStartTime(),
                request.getEndTime()
        ).toHours();

        if (hours <= 0) {
            hours = 1;
        }

        long days = (long) Math.ceil((double) hours / 24);
        if(days <= 0)
        {
            days = 1;
        }
        return vehicle.getPricePerDay().multiply(BigDecimal.valueOf(days));
    }
}
