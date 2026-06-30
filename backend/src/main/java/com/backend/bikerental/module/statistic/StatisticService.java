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
    }

    @Transactional(readOnly = true)
    public List<ChartDataResponse> getMonthlyRevenueChart(Integer year) {
        int targetYear = (year != null) ? year : java.time.Year.now().getValue();

        List<Object[]> rawData = paymentRepository.getMonthlyRevenue(targetYear);

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
        List<Object[]> rawData = bookingRepository.getPopularVehicleBrands();

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
