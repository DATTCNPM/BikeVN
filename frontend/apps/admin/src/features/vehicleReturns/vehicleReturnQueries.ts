import { useQuery } from "@tanstack/react-query";
import { vehicleReturnAdminApi } from "@repo/api";
import type {
  VehicleReturnFilterParams,
  PaginationResponse,
  VehicleReturn,
} from "@repo/types";
import { vehicleReturnQueryKeys } from "./vehicleReturnQueryKeys";

// 1. Lấy chi tiết biên bản trả xe theo mã Booking
export const useVehicleReturnByBookingId = (bookingId: string) => {
  return useQuery<VehicleReturn, VehicleReturn>({
    queryKey: vehicleReturnQueryKeys.detail(bookingId),
    queryFn: () => vehicleReturnAdminApi.getVehicleReturnByBookingId(bookingId),
    enabled: !!bookingId,
  });
};

// 2. Hook lấy toàn bộ danh sách biên bản (Dành cho Admin)
export const useVehicleReturnsAll = (page = 1, size = 10) => {
  return useQuery<
    PaginationResponse<VehicleReturn[]>,
    PaginationResponse<VehicleReturn[]>
  >({
    queryKey: vehicleReturnQueryKeys.list(page, size),
    queryFn: async () => {
      const response = await vehicleReturnAdminApi.getVehicleReturnAll(
        page,
        size,
      );
      return response;
    },
  });
};

// 3. Hook lấy danh sách biên bản theo chi nhánh (Dành cho Employee)
export const useVehicleReturnsPerBranch = (page = 1, size = 10) => {
  return useQuery<
    PaginationResponse<VehicleReturn[]>,
    PaginationResponse<VehicleReturn[]>
  >({
    queryKey: vehicleReturnQueryKeys.branchList(page, size),
    queryFn: async () => {
      const response = await vehicleReturnAdminApi.getVehicleReturnsPerBranch(
        page,
        size,
      );
      return response;
    },
  });
};

// 4. Hook lọc tìm kiếm nâng cao
export const useFilterVehicleReturns = (params: VehicleReturnFilterParams) => {
  return useQuery<
    PaginationResponse<VehicleReturn[]>,
    PaginationResponse<VehicleReturn[]>
  >({
    queryKey: vehicleReturnQueryKeys.filter(params),
    queryFn: async () => {
      const response = await vehicleReturnAdminApi.filterVehicleReturns(params);
      return response;
    },
    // Giữ lại dữ liệu cũ trong lúc fetch dữ liệu mới (Tránh tình trạng loading giật màn hình khi đổi page/filter)
    placeholderData: (previousData) => previousData,
  });
};
