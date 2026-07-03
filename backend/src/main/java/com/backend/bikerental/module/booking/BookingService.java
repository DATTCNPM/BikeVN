package com.backend.bikerental.module.booking;

import com.backend.bikerental.core.component.PricingCalculator;
import com.backend.bikerental.module.booking.dto.BookingCreationRequest;
import com.backend.bikerental.module.booking.dto.BookingResponse;
import com.backend.bikerental.core.dto.PageResponse;
import com.backend.bikerental.module.payment.PaymentRepository;
import com.backend.bikerental.module.user.User;
import com.backend.bikerental.module.vehicle.Vehicle;
import com.backend.bikerental.module.booking.enums.BookingStatus;
import com.backend.bikerental.module.payment.enums.PaymentStatus;
import com.backend.bikerental.module.vehicle.enums.StatusVehicleEnum;
import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.backend.bikerental.module.branch.BranchRepository;
import com.backend.bikerental.module.user.UserRepository;
import com.backend.bikerental.module.vehicle.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    PricingCalculator pricingCalculator;
    private static final int EXPIRE_MINUTES = 20;
    private final BookingLockRepository bookingLockRepository;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    @PreAuthorize("isAuthenticated()")
    public BookingResponse createBooking(BookingCreationRequest request) {

        validateRequest(request);
        validateExistence(request);

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!isAdmin && !user.getEmail().equals(auth.getName())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Vehicle vehicle = vehicleRepository.findByIdForUpdate(request.getVehicleId())
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        if(!vehicle.getStatus().equals(StatusVehicleEnum.available))
        {
            throw new AppException(ErrorCode.VEHICLE_NOT_AVAILABLE);
        }

        boolean isLockedByOther = bookingLockRepository.existsActiveLockByOthers(
                request.getVehicleId(), request.getUserId(), request.getStartTime(), request.getEndTime(), LocalDateTime.now());

        if (isLockedByOther)
        {
            throw new AppException(ErrorCode.VEHICLE_ALREADY_LOCKED);
        }

        if (bookingRepository.existsApprovedBooking(
                request.getVehicleId(), request.getStartTime(), request.getEndTime())) {
            throw new AppException(ErrorCode.VEHICLE_ALREADY_LOCKED);
        }

        bookingRepository.findFirstByUserIdAndStatus(request.getUserId(), BookingStatus.pending)
                .ifPresent(old -> {
                    old.setStatus(BookingStatus.cancelled);
                    old.setUpdatedAt(LocalDateTime.now());
                    bookingRepository.save(old);
                    bookingLockService.releaseLockByVehicleAndUser(old.getVehicleId(), request.getUserId());
                });

        //create soft lock
        bookingLockService.createLock(request.getVehicleId(), request.getUserId(),
                request.getStartTime(), request.getEndTime(), EXPIRE_MINUTES);

        Booking booking = bookingMapper.toBooking(request);
        enrichBooking(booking, vehicle);

        return bookingMapper.toBookingResponse(bookingRepository.save(booking)
        );
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public BookingResponse getBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        User user = userRepository.findById(booking.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isStaff = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin")
                        || a.getAuthority().equals("ROLE_employee"));

        if (!isStaff && !user.getEmail().equals(auth.getName())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return bookingMapper.toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('admin')")
    public PageResponse<BookingResponse> getAllBooking(int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Booking> pageData = bookingRepository.findAll(pageable);

        var bookingResponses = pageData.getContent().stream()
                .map(bookingMapper::toBookingResponse)
                .toList();

        return PageResponse.<BookingResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(bookingResponses)
                .build();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public PageResponse<BookingResponse> getAllBookingByBranch(int page, int size)
    {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        User employee = userRepository.findByEmail(auth.getName())
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        String branchId = employee.getBranch() != null ? employee.getBranch().getId() : null;
        if (branchId == null)
        {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Booking> pageData = bookingRepository
                .findByPickupBranchIdOrReturnBranchId(branchId, branchId, pageable);

        var bookingResponses = pageData.getContent().stream()
                .map(bookingMapper::toBookingResponse)
                .toList();

        return PageResponse.<BookingResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(bookingResponses)
                .build();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<BookingResponse> getBookingsByUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        if (!isAdmin && !user.getEmail().equals(auth.getName())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

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

        User user = userRepository.findById(booking.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a-> a.getAuthority().equals("ROLE_admin"));

        if(!isAdmin && !user.getEmail().equals(auth.getName()))
        {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (booking.getStatus() == BookingStatus.completed) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_COMPLETED);
        }
        booking.setStatus(BookingStatus.cancelled);
        booking.setUpdatedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(), booking.getUserId());
    }

    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public void approveBooking(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        booking.setStatus(BookingStatus.approved);
        booking.setUpdatedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        Vehicle vehicle = vehicleRepository.findById(booking.getVehicleId())
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        vehicle.setStatus(StatusVehicleEnum.rented);
        vehicleRepository.save(vehicle);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public void rejectBooking(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        booking.setStatus(BookingStatus.rejected);
        booking.setUpdatedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(), booking.getUserId());
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

        if (!branchRepository.existsById(request.getPickupBranchId())
                || !branchRepository.existsById(request.getReturnBranchId())) {
            throw new AppException(ErrorCode.BRANCH_NOT_EXISTED);
        }
    }

    private void enrichBooking(Booking booking, Vehicle vehicle) {

        LocalDateTime now = LocalDateTime.now();

        booking.setStatus(BookingStatus.pending);
        booking.setTotalPrice(pricingCalculator.calculateBookingPrice(
                booking.getStartTime(),
                booking.getEndTime(),
                vehicle.getPricePerDay())
        );
        booking.setCreatedAt(now);
        booking.setUpdatedAt(now);
        booking.setExpiresAt(now.plusMinutes(EXPIRE_MINUTES));// set time expire
    }

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> filterBookings(
            String userId,
            String vehicleId,
            String branchId,
            BookingStatus status,
            LocalDate fromDate,
            LocalDate toDate,
            int page,
            int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size);

        Specification<Booking> spec = BookingSpecification.filterBookings(
                userId, vehicleId, branchId, status, fromDate, toDate
        );

        Page<Booking> pageData = bookingRepository.findAll(spec, pageable);

        var bookingResponses = pageData.getContent().stream()
                .map(bookingMapper::toBookingResponse)
                .toList();

        return PageResponse.<BookingResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(bookingResponses)
                .build();
    }

}
