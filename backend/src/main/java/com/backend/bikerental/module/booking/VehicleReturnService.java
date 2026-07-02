package com.backend.bikerental.module.booking;

import com.backend.bikerental.core.component.PricingCalculator;
import com.backend.bikerental.module.booking.dto.VehicleReturnRequest;
import com.backend.bikerental.core.dto.PageResponse;
import com.backend.bikerental.module.payment.dto.PaymentResponse;
import com.backend.bikerental.module.booking.dto.VehicleReturnResponse;
import com.backend.bikerental.module.user.User;
import com.backend.bikerental.module.vehicle.enums.StatusVehicleEnum;
import com.backend.bikerental.module.vehicle.enums.VehicleConditionStatus;
import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.backend.bikerental.module.branch.Branch;
import com.backend.bikerental.module.branch.BranchRepository;
import com.backend.bikerental.module.user.UserRepository;
import com.backend.bikerental.module.vehicle.Vehicle;
import com.backend.bikerental.module.vehicle.VehicleRepository;
import com.backend.bikerental.core.component.FileStorageService;
import com.backend.bikerental.module.payment.PaymentService;
import com.backend.bikerental.module.branch.BranchSecurityUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleReturnService {
    VehicleReturnRepository vehicleReturnRepository;
    VehicleReturnMapper vehicleReturnMapper;
    FileStorageService fileStorageService;
    PaymentService paymentService;
    BranchSecurityUtil branchSecurityUtil;
    PricingCalculator pricingCalculator;
    BookingRepository bookingRepository;
    BranchRepository branchRepository;
    VehicleRepository vehicleRepository;
    UserRepository userRepository;
    @Transactional
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public VehicleReturnResponse createReturn(VehicleReturnRequest request)
    {
        branchSecurityUtil.verifyBranchAccess(request.getReturnBranchId());

        if(!userRepository.existsById(request.getEmployeeId())) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        if(vehicleReturnRepository.existsByBookingId(request.getBookingId()))
        {
            throw new AppException(ErrorCode.RETURN_ALREADY_EXISTS);
        }

        VehicleReturn vehicleReturn = vehicleReturnMapper.toVehicleReturn(request);

        LocalDateTime now = LocalDateTime.now();
        vehicleReturn.setCreatedAt(now);
        vehicleReturn.setUpdatedAt(now);

        List<String> imagesUrl = fileStorageService.storeVehicleReturnImages(request.getImages());
        vehicleReturn.setImages(imagesUrl);

        BigDecimal damageFee = pricingCalculator.calculateExtraFee(request.getExtraFee());

        PaymentResponse paymentResponse = paymentService.createExtraFeePayment(
                request.getBookingId(),
                damageFee,
                request.getReturnBranchId(),
                request.getPaymentMethod()
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

        VehicleReturn savedReturn = vehicleReturnRepository.save(vehicleReturn);
        VehicleReturnResponse vehicleReturnResponse = vehicleReturnMapper.toVehicleReturnResponse(savedReturn);

        if(paymentResponse != null)
        {
            vehicleReturnResponse.setPayment(paymentResponse);
        }

        return vehicleReturnResponse;
    }
    @Transactional
    private void updateVehicleAfterReturn(String bookingId, String returnBranchId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        Vehicle vehicle = vehicleRepository.findById(booking.getVehicleId())
                .orElseThrow(() -> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        Branch returnBranch = branchRepository.findById(returnBranchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));

        vehicle.setStatus(StatusVehicleEnum.maintenance);
        vehicle.setCurrentBranch(returnBranch);

        vehicleRepository.save(vehicle);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('admin')")
    public PageResponse<VehicleReturnResponse> getAllReturns(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<VehicleReturn> pageData = vehicleReturnRepository.findAll(pageable);

        var returnResponses = pageData.getContent().stream()
                .map(vehicleReturnMapper::toVehicleReturnResponse)
                .toList();

        return PageResponse.<VehicleReturnResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(returnResponses)
                .build();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('employee')")
    public PageResponse<VehicleReturnResponse> getAllReturnsPerBranch(int page, int size) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (!(auth instanceof JwtAuthenticationToken jwtToken)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String tokenBranchId = (String) jwtToken.getTokenAttributes().get("branchId");
        if (tokenBranchId == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<VehicleReturn> pageData = vehicleReturnRepository.findByReturnBranchId(tokenBranchId, pageable);

        var returnResponses = pageData.getContent().stream()
                .map(vehicleReturnMapper::toVehicleReturnResponse)
                .toList();

        return PageResponse.<VehicleReturnResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(returnResponses)
                .build();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public VehicleReturnResponse getReturnByBookingId(String bookingId)
    {
        VehicleReturn vehicleReturn = vehicleReturnRepository.findByBookingId(bookingId)
                .orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isStaff = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin")
                        || a.getAuthority().equals("ROLE_employee"));

        if (!isStaff) {
            User user = userRepository.findById(booking.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            
            if (!user.getEmail().equals(auth.getName())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
        return vehicleReturnMapper.toVehicleReturnResponse(vehicleReturn);
    }

    //FILTER
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public PageResponse<VehicleReturnResponse> filterReturns(
            String bookingId, String returnBranchId, VehicleConditionStatus conditionStatus,
            LocalDate fromDate, LocalDate toDate, int page, int size) {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        if (!isAdmin) {
            if (auth instanceof JwtAuthenticationToken jwtToken) {
                returnBranchId = (String) jwtToken.getTokenAttributes().get("branchId");
            }
        }

        Pageable pageable = PageRequest.of(page - 1, size);

        Specification<VehicleReturn> spec = VehicleReturnSpecification.filterVehicleReturns(
                bookingId, returnBranchId, conditionStatus, fromDate, toDate
        );

        Page<VehicleReturn> pageData = vehicleReturnRepository.findAll(spec, pageable);

        var returnResponses = pageData.getContent().stream()
                .map(vehicleReturnMapper::toVehicleReturnResponse)
                .toList();

        return PageResponse.<VehicleReturnResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(returnResponses)
                .build();
    }
}
