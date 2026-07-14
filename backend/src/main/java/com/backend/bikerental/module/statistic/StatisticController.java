package com.backend.bikerental.module.statistic;

import com.backend.bikerental.core.dto.ApiResponse;
import com.backend.bikerental.module.statistic.dto.AdminGeneralStatResponse;
import com.backend.bikerental.module.statistic.dto.ChartDataResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StatisticController {
    StatisticService statisticService;

    @GetMapping("/general")
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public ApiResponse<AdminGeneralStatResponse> getAdminGeneralStats()
    {
        return ApiResponse.<AdminGeneralStatResponse>builder()
                .result(statisticService.getAdminGeneralStats())
                .build();
    }

    @GetMapping("/charts/revenue-monthly")
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public ApiResponse<List<ChartDataResponse>> getMonthlyRevenueChart
            (@RequestParam(required = false) Integer year)
    {
        return ApiResponse.<List<ChartDataResponse>>builder()
                .result(statisticService.getMonthlyRevenueChart(year))
                .build();
    }

    @GetMapping("charts/revenue-branch")
    @PreAuthorize("hasRole('admin')")
    public ApiResponse<List<ChartDataResponse>> getRevenueByBranchChart()
    {
        return ApiResponse.<List<ChartDataResponse>>builder()
                .result(statisticService.getRevenueByBranchChart())
                .build();
    }

    @GetMapping("charts/popular-vehicles")
    @PreAuthorize("hasAnyRole('admin', 'employee')")
    public ApiResponse<List<ChartDataResponse>> getPopularVehiclesChart()
    {
        return ApiResponse.<List<ChartDataResponse>>builder()
                .result(statisticService.getPopularVehiclesChart())
                .build();
    }
}
