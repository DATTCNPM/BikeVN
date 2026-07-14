package com.backend.bikerental.module.payment;

import com.backend.bikerental.core.component.PricingCalculator;
import com.backend.bikerental.core.dto.PageResponse;
import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.backend.bikerental.module.booking.Booking;
import com.backend.bikerental.module.booking.BookingLockService;
import com.backend.bikerental.module.booking.BookingRepository;
import com.backend.bikerental.module.booking.enums.BookingStatus;
import com.backend.bikerental.module.branch.BranchSecurityUtil;
import com.backend.bikerental.module.chat.dto.NotificationMessage;
import com.backend.bikerental.module.payment.dto.PaymentCreationRequest;
import com.backend.bikerental.module.payment.dto.PaymentResponse;
import com.backend.bikerental.module.payment.enums.PaymentStatus;
import com.backend.bikerental.module.payment.enums.PaymentType;
import com.backend.bikerental.module.user.User;
import com.backend.bikerental.module.user.UserRepository;
import com.backend.bikerental.module.vehicle.Vehicle;
import com.backend.bikerental.module.vehicle.VehicleRepository;
import com.backend.bikerental.module.vehicle.enums.StatusVehicleEnum;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {

    PaymentRepository paymentRepository;
    BookingRepository bookingRepository;
    PricingCalculator pricingCalculator;
    BookingLockService bookingLockService;
    PaymentMapper paymentMapper;
    VehicleRepository vehicleRepository;
    BranchSecurityUtil branchSecurityUtil;
    UserRepository userRepository;
    VNPayService vnPayService;
    SimpMessagingTemplate messagingTemplate;
    static final int EXPIRE_MINUTES = 20;
    @Transactional
    public PaymentResponse createPayment(PaymentCreationRequest request) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (booking.getStatus() == BookingStatus.completed) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_COMPLETED);
        }
        if (booking.getStatus() == BookingStatus.pending
                && booking.getExpiresAt() != null
                && booking.getExpiresAt().isBefore(LocalDateTime.now()))
        {
            throw new AppException(ErrorCode.BOOKING_EXPIRED);
        }
        // idempotency
        paymentRepository.findByIdempotencyKey(request.getIdempotencyKey())
                .ifPresent(p -> {
                    throw new AppException(ErrorCode.DUPLICATE_PAYMENT);
                });

        // nếu đã có pending → reuse
        Optional<Payment> existing = paymentRepository
                .findFirstByBookingIdAndStatus(request.getBookingId(), PaymentStatus.pending);

        if (existing.isPresent()) {
            return buildResponse(existing.get(), booking);
        }

        Payment payment = new Payment();
        LocalDateTime now = LocalDateTime.now();

        payment.setBookingId(booking.getId());
        payment.setAmount(booking.getTotalPrice());
        payment.setStatus(PaymentStatus.pending);
        payment.setPaymentMethod("bank_transfer");
        payment.setIdempotencyKey(request.getIdempotencyKey());
        payment.setBranchId(booking.getPickupBranchId());
        payment.setType(PaymentType.rental);
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);

        paymentRepository.save(payment);

        return buildResponse(payment, booking);
    }

    @Transactional
    public PaymentResponse createExtraFeePayment(String bookingId, BigDecimal damageFee,
                                                 String actualReturnBranchId,
                                                 String paymentMethod)
    {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        LocalDateTime now = LocalDateTime.now();

        var fee = pricingCalculator.calculateTotalExtraFee(
                booking.getReturnBranchId(),
                actualReturnBranchId,
                damageFee,
                booking.getEndTime(),
                now
        );


        if (fee.totalFee().compareTo(BigDecimal.ZERO) <= 0)
        {
            booking.setStatus(BookingStatus.completed);
            booking.setExpiresAt(null);
            booking.setActualReturnTime(now);
            bookingRepository.save(booking);
            return null;
        }

        Payment payment = new Payment();
        payment.setBookingId(booking.getId());
        payment.setBranchId(actualReturnBranchId);
        payment.setAmount(fee.totalFee());
        payment.setStatus(PaymentStatus.pending);

        payment.setPaymentMethod(paymentMethod != null ? paymentMethod : "unspecified");
        payment.setType(PaymentType.extra_fee);

        payment.setIdempotencyKey("EXTRA_FEE_" + bookingId + "_" + now.toEpochSecond(java.time.ZoneOffset.UTC));
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);

        booking.setActualReturnTime(now);

        Payment savedPayment = paymentRepository.save(payment);
        bookingRepository.save(booking);

        PaymentResponse paymentResponse = buildResponse(savedPayment, booking);

        if("cash".equalsIgnoreCase(paymentMethod)) {
            paymentResponse.setTransferContent("Please pay in cash at the counter");
        }
        else {
            paymentResponse.setTransferContent(fee.invoiceDetails());
        }

        return paymentResponse;

    }
    @Transactional
    public void confirmPayment(String paymentId, String transactionCode) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getStatus() == PaymentStatus.completed) {
            return; // idempotent
        }

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        // SUCCESS
        payment.setStatus(PaymentStatus.completed);
        payment.setTransactionCode(transactionCode);
        payment.setPaidAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());


        Vehicle vehicle = vehicleRepository.findById(booking.getVehicleId())
                .orElseThrow(()-> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));

        if(PaymentType.rental.equals(payment.getType()))
        {
            booking.setStatus(BookingStatus.approved);
            booking.setExpiresAt(null);

            vehicle.setStatus(StatusVehicleEnum.rented);
            vehicleRepository.save(vehicle);

            bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(), booking.getUserId());
        }
        else if(PaymentType.extra_fee.equals(payment.getType()))
        {
            booking.setStatus(BookingStatus.completed);
            booking.setExpiresAt(null);
        }

        paymentRepository.save(payment);
        bookingRepository.save(booking);

        bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(),booking.getUserId());

        String branchId = booking.getPickupBranchId();

        NotificationMessage notificationMessage = NotificationMessage.builder()
                .type("NEW_BOOKING_ALERT")
                .branchId(branchId)
                .title("New Booking !!!")
                .content("Xe " + vehicle.getName() + " (License: " + vehicle.getLicensePlate() +
                        ") just rented!!!")
                .referenceId(booking.getId())
                .build();
        messagingTemplate.convertAndSend(
                "/topic/branch/" + branchId + "/notifications", notificationMessage
        );

    }

    @Transactional
    public void processIpnPayment(String paymentId, long vnpAmount, String responseCode, String transactionCode) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        long dbAmount = payment.getAmount().longValue();
        if (dbAmount != vnpAmount) {
            throw new AppException(ErrorCode.INVALID_AMOUNT);
        }

        if (payment.getStatus() == PaymentStatus.completed) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_COMPLETED);
        }

        Booking booking = bookingRepository.findById(payment.getBookingId()).get();

        if ("00".equals(responseCode)) {

            if (booking.getStatus() == BookingStatus.cancelled || booking.getStatus() == BookingStatus.rejected) {
                payment.setTransactionCode(transactionCode);
                payment.setPaidAt(LocalDateTime.now());
                payment.setStatus(PaymentStatus.completed);

                handleRefundLogic(booking, payment);
                return;
            }
            confirmPayment(paymentId, transactionCode);
        }
        else {
            payment.setStatus(PaymentStatus.failed);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(), booking.getUserId());
        }
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expirePayments() {
        List<Payment> payments = paymentRepository.findByStatus(PaymentStatus.pending);
        LocalDateTime now = LocalDateTime.now();

        for (Payment p : payments) {
            if (isExpired(p)){
                p.setStatus(PaymentStatus.failed);
                p.setUpdatedAt(now);
            }
        }

        paymentRepository.saveAll(payments);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('admin')")
   public PageResponse<PaymentResponse> getAllPayments(int page, int size)
   {
       Pageable pageable = PageRequest.of(page - 1, size);
       Page<Payment> pageData = paymentRepository.findAll(pageable);

       var paymentResponses = pageData.getContent().stream()
               .map(paymentMapper::toPaymentResponse)
               .toList();

       return PageResponse.<PaymentResponse>builder()
               .currentPage(page)
               .totalPages(pageData.getTotalPages())
               .pageSize(size)
               .totalElements(pageData.getTotalElements())
               .data(paymentResponses)
               .build();
   }

   @Transactional(readOnly = true)
   @PreAuthorize("hasAnyRole('admin', 'employee')")
   public PageResponse<PaymentResponse> getAllPaymentPerBranch(int page, int size)
   {
       var auth = SecurityContextHolder.getContext().getAuthentication();
       if(!(auth instanceof JwtAuthenticationToken jwtAuthenticationToken))
       {
           throw new AppException(ErrorCode.UNAUTHENTICATED);
       }

       String tokenBranchId = (String) jwtAuthenticationToken.getTokenAttributes().get("branchId");
       if(tokenBranchId == null)
       {
           throw new AppException(ErrorCode.UNAUTHORIZED);
       }

       Pageable pageable = PageRequest.of(page - 1, size);

       Page<Payment> pageData = paymentRepository.findByBranchId(tokenBranchId, pageable);

       var paymentResponses = pageData.getContent().stream()
               .map(paymentMapper::toPaymentResponse)
               .toList();

       return PageResponse.<PaymentResponse>builder()
               .currentPage(page)
               .totalPages(pageData.getTotalPages())
               .pageSize(size)
               .totalElements(pageData.getTotalElements())
               .data(paymentResponses)
               .build();
   }

    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public PaymentResponse getPayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdminOrEmployee = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin") || a.getAuthority().equals("ROLE_employee"));

        if (!isAdminOrEmployee) {
            User user = userRepository.findById(booking.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            // So sánh Email trong DB với Email trong Token
            if (!user.getEmail().equals(auth.getName())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        return buildResponse(payment, booking);
    }

    private boolean isExpired(Payment payment) {
        LocalDateTime now = LocalDateTime.now();

        if(payment.getType() == PaymentType.extra_fee)
        {
            return payment.getCreatedAt().isBefore(now.minusHours(2));//2 hours
        }
        return payment.getCreatedAt()
                .isBefore(LocalDateTime.now().minusMinutes(EXPIRE_MINUTES));
    }

    //xac nhan thanh toan thu cong
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public PaymentResponse approvePaymentManually(String paymentId, String adminId, String actualPaymentMethod)
    {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(()-> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        if(payment.getStatus() == PaymentStatus.completed)
        {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_COMPLETED);
        }

        branchSecurityUtil.verifyBranchAccess(payment.getBranchId());

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        payment.setPaymentMethod(actualPaymentMethod);
        payment.setStatus(PaymentStatus.completed);
        payment.setTransactionCode("MANUAL_" + adminId + "_" + System.currentTimeMillis());//exp
        payment.setPaidAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        if(payment.getType() == PaymentType.rental) {
            booking.setStatus(BookingStatus.approved);
            booking.setExpiresAt(null);

            Vehicle vehicle = vehicleRepository.findById(booking.getVehicleId())
                    .orElseThrow(() -> new AppException(ErrorCode.VEHICLE_NOT_EXISTED));
            vehicle.setStatus(StatusVehicleEnum.unavailable);
            vehicleRepository.save(vehicle);

            bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(), booking.getUserId());
        } else if (payment.getType() == PaymentType.extra_fee) {
            booking.setStatus(BookingStatus.completed);
            booking.setExpiresAt(null);
        }

        paymentRepository.save(payment);
        bookingRepository.save(booking);

        return buildResponse(payment, booking);
    }

    @Transactional
    @PreAuthorize("isAuthenticated()")
    public PaymentResponse retryPayment(String paymentId, String newPaymentMethod)
    {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(()-> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if(payment.getStatus() == PaymentStatus.completed)
        {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_COMPLETED);
        }

        if(payment.getStatus() == PaymentStatus.failed || payment.getStatus() == PaymentStatus.pending)
        {
            payment.setStatus(PaymentStatus.pending);
            payment.setPaymentMethod(newPaymentMethod != null ? newPaymentMethod : "unspecified");
            payment.setUpdatedAt(LocalDateTime.now());

            paymentRepository.save(payment);
        }

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        return buildResponse(payment, booking);
    }

    @Transactional
    @PreAuthorize("isAuthenticated()")
    public PaymentResponse cancelPayment(String paymentId, String reason)
    {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(()-> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin") || a.getAuthority().equals("ROLE_employee"));

        User user = userRepository.findById(booking.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        boolean isOwner = user.getEmail().equals(currentEmail);

        if (!isStaff && !isOwner) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if(payment.getStatus() == PaymentStatus.pending) {
            payment.setStatus(PaymentStatus.failed);
        }
        else if (payment.getStatus() == PaymentStatus.completed)
        {
            handleRefundLogic(booking, payment);
        }

        payment.setUpdatedAt(LocalDateTime.now());
        booking.setStatus(BookingStatus.cancelled);
        booking.setExpiresAt(null);
        booking.setUpdatedAt(LocalDateTime.now());

        paymentRepository.save(payment);
        bookingRepository.save(booking);

        bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(), booking.getUserId());
        return buildResponse(payment, booking);
    }

    private PaymentResponse buildResponse(Payment payment, Booking booking) {

        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(booking.getId())
                .branchId(payment.getBranchId())
                .amount(payment.getAmount())
                .type(payment.getType().name())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())

                .createdAt(payment.getCreatedAt())
                .build();
    }

    //FILTER
    @Transactional(readOnly = true)
    public PageResponse<PaymentResponse> filterPayments(
            String bookingId,
            String transactionCode,
            String branchId,
            PaymentStatus status,
            PaymentType type,
            String notes,
            LocalDate fromDate,
            LocalDate toDate,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<Payment> specification = PaymentSpecification.filterPayments(
                bookingId, transactionCode, branchId, status, type, notes, fromDate, toDate
        );

        Page<Payment> pageData = paymentRepository.findAll(specification, pageable);

        var paymentResponses = pageData.getContent().stream()
                .map(paymentMapper::toPaymentResponse)
                .toList();

        return PageResponse.<PaymentResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .pageSize(size)
                .totalElements(pageData.getTotalElements())
                .data(paymentResponses)
                .build();
    }

    @Transactional
    @PreAuthorize("hasRole('admin')")
    public PaymentResponse processRefund(String paymentId, String adminId, String ipAddress) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getStatus() == PaymentStatus.refunded) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_COMPLETED);
        }

        if(payment.getStatus() != PaymentStatus.processing_refund &&
                payment.getStatus() != PaymentStatus.completed)
        {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String paidDate = payment.getPaidAt().format(formatter);

        boolean isRefundSuccess = vnPayService.refundPayment(
                payment.getId(),
                payment.getAmount().longValue(),
                payment.getTransactionCode(),
                paidDate,
                ipAddress,
                adminId
        );

        if (isRefundSuccess) {
            payment.setStatus(PaymentStatus.refunded);
            payment.setNotes("REFUNDED_SUCCESSFULLY");
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            return buildResponse(payment, bookingRepository.findById(payment.getBookingId()).get());
        } else {
            payment.setNotes("REFUND_FAILED");
            paymentRepository.save(payment);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public void handleRefundLogic(Booking booking, Payment payment)
    {
        boolean isEligibleForRefund =
                booking.getStatus() == BookingStatus.cancelled ||
                        booking.getStatus() == BookingStatus.rejected;

        if(isEligibleForRefund)
        {
            payment.setStatus(PaymentStatus.processing_refund);
            payment.setNotes("NEEDS_REFUND");
            paymentRepository.save(payment);
        }

        NotificationMessage notificationMessage = NotificationMessage.builder()
                .type("NEED_REFUND_ALERT")
                .branchId(payment.getBranchId())
                .title("Need Refund !!!")
                .content("Payment " + payment.getId() + "need refund")
                .referenceId(payment.getBookingId())
                .build();

        messagingTemplate.convertAndSend(
                "/topic/branch/" + payment.getBranchId() + "/notifications", notificationMessage
        );
    }
}

