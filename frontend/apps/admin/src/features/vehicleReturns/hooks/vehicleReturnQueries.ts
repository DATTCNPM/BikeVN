import { useQuery } from "@tanstack/react-query";
import { vehicleReturnAdminApi } from "../api/vehicleReturnAdminApi";
import type { VehicleReturnFilterParams, VehicleReturn } from "@repo/schemas";
import type { PaginationResponse } from "@repo/types";
import { vehicleReturnQueryKeys } from "./vehicleReturnQueryKeys";

// 1. Lấy chi tiết biên bản trả xe theo mã Booking - GIỮ NGUYÊN
export const useVehicleReturnByBookingId = (bookingId: string) => {
  return useQuery<VehicleReturn, Error>({
    queryKey: vehicleReturnQueryKeys.detail(bookingId),
    queryFn: () => vehicleReturnAdminApi.getVehicleReturn(bookingId),
    enabled: !!bookingId,
  });
};

// 2. Hook lấy toàn bộ danh sách biên bản (SỬA TYPE)
export const useVehicleReturnsAll = (page = 1, size = 10) => {
  return useQuery<PaginationResponse<VehicleReturn>, Error>({
    queryKey: vehicleReturnQueryKeys.list(page, size),
    queryFn: () => vehicleReturnAdminApi.getVehicleReturnAll(page, size),
  });
};

// 3. Hook lấy danh sách biên bản theo chi nhánh (SỬA TYPE)
export const useVehicleReturnsPerBranch = (page = 1, size = 10) => {
  return useQuery<PaginationResponse<VehicleReturn>, Error>({
    queryKey: vehicleReturnQueryKeys.branchList(page, size),
    queryFn: () => vehicleReturnAdminApi.getVehicleReturnsPerBranch(page, size),
  });
};

// 4. Hook lọc tìm kiếm nâng cao (SỬA TYPE VÀ KHỚP ĐÚNG PHÂN TRANG)
export const useFilterVehicleReturns = (params: VehicleReturnFilterParams) => {
  return useQuery<PaginationResponse<VehicleReturn>, Error>({
    queryKey: vehicleReturnQueryKeys.filter(params),
    queryFn: () => vehicleReturnAdminApi.filterVehicleReturns(params),
    placeholderData: (previousData) => previousData, // Giữ dữ liệu mượt mà khi qua trang mới
  });
};
