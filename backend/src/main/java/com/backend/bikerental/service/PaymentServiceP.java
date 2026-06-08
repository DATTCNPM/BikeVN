package com.backend.bikerental.service;

import com.backend.bikerental.dto.request.PaymentCreationRequest;
import com.backend.bikerental.dto.response.PaymentResponse;
import com.backend.bikerental.entity.Booking;
import com.backend.bikerental.entity.Payment;
import com.backend.bikerental.enums.BookingStatus;
import com.backend.bikerental.enums.PaymentStatus;
import com.backend.bikerental.enums.PaymentType;
import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import com.backend.bikerental.repository.BookingRepository;
import com.backend.bikerental.repository.PaymentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentServiceP {

    PaymentRepository paymentRepository;
    BookingRepository bookingRepository;
    BookingService bookingService;
    BookingLockService bookingLockService;
    static final String BANK_NAME = "";
    static final String BANK_ACCOUNT = "1223445";
    static final String ACCOUNT_NAME = "Tran Hoang Phuong";

    static final int EXPIRE_MINUTES = 10;
    @Transactional
    public PaymentResponse createPayment(PaymentCreationRequest request) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (booking.getStatus() == BookingStatus.completed) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_COMPLETED);
        }
        if(booking.getExpiresAt() != null && booking.getExpiresAt().isBefore(LocalDateTime.now()))
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
        payment.setType(PaymentType.deposit);
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);

        System.out.println(payment.getType());
        System.out.println(PaymentType.deposit);

        paymentRepository.save(payment);
        System.out.println("DB TYPE = " + payment.getType());

        return buildResponse(payment, booking);
    }

    @Transactional
    public PaymentResponse createExtraFeePayment(String bookingId, BigDecimal damageFee,
                                                 String actualReturnBranchId)
    {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        LocalDateTime now = LocalDateTime.now();

        BigDecimal totalExtraFee = BigDecimal.ZERO;

        //Hoa don
        StringBuilder feeDetailsBuilder = new StringBuilder("Surcharge details: ");
        boolean hasFee = false;
        //WRONG BRANCH
        if(!booking.getReturnBranchId().equals(actualReturnBranchId))
        {
            totalExtraFee = totalExtraFee.add(BigDecimal.valueOf(50000));
            feeDetailsBuilder.append("Wrong Branch: 50,000VND");
            hasFee = true;
        }

        //DAMAGE FEE
        if(damageFee != null && damageFee.compareTo(BigDecimal.ZERO) > 0)
        {
            totalExtraFee = totalExtraFee.add(damageFee);
            feeDetailsBuilder.append("Damage Fee: ").append(damageFee).append("VND");
            hasFee = true;
        }

        //LATE RETURN
        if(now.isAfter(booking.getEndTime()))
        {
            long lateHours = ChronoUnit.HOURS.between(booking.getEndTime(), now);
            long lateDays = (lateHours / 24) + (lateHours % 24 > 0 ? 1 :0);

            if (lateDays > 0)
            {
                BigDecimal lateFee = BigDecimal.valueOf(lateDays * 250000L);
                totalExtraFee = totalExtraFee.add(lateFee);
                feeDetailsBuilder.append("Late Day Fee: ").append(lateDays).append("VND");
                hasFee = true;
            }
        }

        if (totalExtraFee.compareTo(BigDecimal.ZERO) <= 0)
        {
            booking.setStatus(BookingStatus.completed);
            booking.setActualReturnTime(now);
            bookingRepository.save(booking);
            return null;
        }

        Payment payment = new Payment();
        payment.setBookingId(booking.getId());
        payment.setAmount(totalExtraFee);
        payment.setStatus(PaymentStatus.pending);

        payment.setPaymentMethod("unspecified");
        payment.setType(PaymentType.extra_fee);

        payment.setIdempotencyKey("EXTRA_FEE_" + bookingId + "_" + now.toEpochSecond(java.time.ZoneOffset.UTC));
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);

        booking.setActualReturnTime(now);

        Payment savedPayment = paymentRepository.save(payment);
        bookingRepository.save(booking);

        PaymentResponse paymentResponse = buildResponse(savedPayment, booking);
        paymentResponse.setTransferContent(feeDetailsBuilder.toString());

        return paymentResponse;

    }
    @Transactional
    public void confirmPayment(String paymentId, String transactionCode) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getStatus() == PaymentStatus.completed) {
            return; // idempotent
        }

        // check expire
        if (isExpired(payment)) {
            payment.setStatus(PaymentStatus.failed);
            paymentRepository.save(payment);
            throw new AppException(ErrorCode.PAYMENT_EXPIRED);
        }

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        // FAILED: overtime locking seat
        if(booking.getExpiresAt() != null && booking.getExpiresAt().isBefore(LocalDateTime.now()))
        {
            payment.setStatus(PaymentStatus.failed);
            paymentRepository.save(payment);
            throw new AppException(ErrorCode.BOOKING_EXPIRED);
        }

        // SUCCESS
        payment.setStatus(PaymentStatus.completed);
        payment.setTransactionCode(transactionCode);
        payment.setPaidAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        booking.setStatus(BookingStatus.approved);

        paymentRepository.save(payment);
        bookingRepository.save(booking);

        bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(),booking.getUserId());
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

   public Page<PaymentResponse> getAllPayments(PaymentStatus status, Pageable pageable)
   {
       Page<Payment> paymentPage;
       if(status != null)
       {
           paymentPage = paymentRepository.findByStatus(status, pageable);
       }
       else {
           paymentPage = paymentRepository.findAll(pageable);
       }

       return paymentPage.map(payment -> {
           Booking booking = bookingRepository.findById(payment.getBookingId())
                   .orElse(new Booking());
           return buildResponse(payment, booking);
       });

   }

    public PaymentResponse getPayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

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

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        payment.setPaymentMethod(actualPaymentMethod);
        payment.setStatus(PaymentStatus.completed);
        payment.setTransactionCode("MANUAL_" + adminId + "_" + System.currentTimeMillis());//exp
        payment.setPaidAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        if(payment.getType() == PaymentType.deposit) {
            booking.setStatus(BookingStatus.approved);
            bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(), booking.getUserId());
        } else if (payment.getType() == PaymentType.extra_fee) {
            booking.setStatus(BookingStatus.completed);
        }

        paymentRepository.save(payment);
        bookingRepository.save(booking);

        return buildResponse(payment, booking);
    }
    @PreAuthorize("isAuthenticated()")
    public PaymentResponse cancelPayment(String paymentId, String reason)
    {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(()-> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(()-> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        //check
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a-> a.getAuthority().equals("ROLE_admin")
                        || a.getAuthority().equals("ROLE_employee"));
        boolean isOwner = booking.getUserId().equals(currentUserId);

        if(!isStaff || !isOwner)
        {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if(payment.getStatus() == PaymentStatus.pending)
        {
            payment.setStatus(PaymentStatus.failed);
        }
        payment.setUpdatedAt(LocalDateTime.now());

        booking.setStatus(BookingStatus.rejected);
        booking.setUpdatedAt(LocalDateTime.now());

        paymentRepository.save(payment);
        bookingRepository.save(booking);

        bookingLockService.releaseLockByVehicleAndUser(booking.getVehicleId(), booking.getUserId());
        return buildResponse(payment, booking);
    }

    private PaymentResponse buildResponse(Payment payment, Booking booking) {

        String content = "BOOKING " + booking.getId();

        String qrContent = "BANK:" + BANK_NAME
                + "|ACC:" + BANK_ACCOUNT
                + "|AMOUNT:" + booking.getTotalPrice()
                + "|INFO:" + content;

        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(booking.getId())
                .amount(payment.getAmount())
                .type(payment.getType().name())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())

                .bankName(BANK_NAME)
                .bankAccount(BANK_ACCOUNT)
                .accountName(ACCOUNT_NAME)
                .transferContent(content)
                .qrContent(qrContent)

                .createdAt(payment.getCreatedAt())
                .build();
    }
}

