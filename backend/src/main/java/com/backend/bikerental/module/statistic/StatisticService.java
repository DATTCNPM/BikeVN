package com.backend.bikerental.module.statistic;

import com.backend.bikerental.module.booking.BookingRepository;
import com.backend.bikerental.module.payment.PaymentRepository;
import com.backend.bikerental.module.payment.enums.PaymentStatus;
import com.backend.bikerental.module.statistic.dto.AdminGeneralStatResponse;
import com.backend.bikerental.module.statistic.dto.ChartDataResponse;
import com.backend.bikerental.module.user.UserRepository;
import com.backend.bikerental.module.vehicle.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.backend.bikerental.module.user.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StatisticService {
    PaymentRepository paymentRepository;
    BookingRepository bookingRepository;
    UserRepository userRepository;
    VehicleRepository vehicleRepository;

    @Transactional(readOnly = true)
    public AdminGeneralStatResponse getAdminGeneralStats()
    {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        if (isAdmin) {
            BigDecimal totalRevenue = paymentRepository.calculateTotalRevenue(PaymentStatus.completed);
            if (totalRevenue == null) {
                totalRevenue = BigDecimal.ZERO;
            }

            long totalBookings = bookingRepository.count();
            long totalCustomers = userRepository.countCustomers();
            long totalEmployees = userRepository.countEmployees();
            long totalVehicles = vehicleRepository.count();

            return AdminGeneralStatResponse.builder()
                    .totalRevenue(totalRevenue)
                    .totalBookings(totalBookings)
                    .totalCustomers(totalCustomers)
                    .totalEmployees(totalEmployees)
                    .totalVehicles(totalVehicles)
                    .build();
        } else {
            User employee = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            String branchId = employee.getBranch() != null ? employee.getBranch().getId() : null;
            if (branchId == null) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            BigDecimal totalRevenue = paymentRepository.calculateTotalRevenueByBranch(PaymentStatus.completed, branchId);
            if (totalRevenue == null) {
                totalRevenue = BigDecimal.ZERO;
            }

            long totalBookings = bookingRepository.countBookingsByBranch(branchId);
            long totalCustomers = bookingRepository.countUniqueCustomersByBranch(branchId);
            long totalEmployees = userRepository.countEmployeesByBranch(branchId);
            long totalVehicles = vehicleRepository.countByCurrentBranchId(branchId);

            return AdminGeneralStatResponse.builder()
                    .totalRevenue(totalRevenue)
                    .totalBookings(totalBookings)
                    .totalCustomers(totalCustomers)
                    .totalEmployees(totalEmployees)
                    .totalVehicles(totalVehicles)
                    .build();
        }
    }

    @Transactional(readOnly = true)
    public List<ChartDataResponse> getMonthlyRevenueChart(Integer year) {
        int targetYear = (year != null) ? year : java.time.Year.now().getValue();

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        List<Object[]> rawData;
        if (isAdmin) {
            rawData = paymentRepository.getMonthlyRevenue(targetYear);
        } else {
            User employee = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            String branchId = employee.getBranch() != null ? employee.getBranch().getId() : null;
            if (branchId == null) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            rawData = paymentRepository.getMonthlyRevenueByBranch(targetYear, branchId);
        }

        return rawData.stream().map(row -> {
            Integer month = (Integer) row[0];
            BigDecimal total = (BigDecimal) row[1];
            return ChartDataResponse.builder()
                    .label("Month " + month)
                    .value(total != null ? total : BigDecimal.ZERO)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChartDataResponse> getRevenueByBranchChart() {
        List<Object[]> rawData = paymentRepository.getRevenueByBranch();

        return rawData.stream().map(row -> {
            String branchName = (String) row[0];
            BigDecimal total = (BigDecimal) row[1];
            return ChartDataResponse.builder()
                    .label(branchName)
                    .value(total != null ? total : BigDecimal.ZERO)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChartDataResponse> getPopularVehiclesChart() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        List<Object[]> rawData;
        if (isAdmin) {
            rawData = bookingRepository.getPopularVehicleBrands();
        } else {
            User employee = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            String branchId = employee.getBranch() != null ? employee.getBranch().getId() : null;
            if (branchId == null) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            rawData = bookingRepository.getPopularVehicleBrandsByBranch(branchId);
        }

        return rawData.stream().map(row -> {
            String brandName = (String) row[0];
            Long count = (Long) row[1]; // COUNT() function in JPA return Long type
            return ChartDataResponse.builder()
                    .label(brandName)
                    .value(count != null ? count : 0L)
                    .build();
        }).collect(Collectors.toList());
    }
}
