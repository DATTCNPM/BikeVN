import axiosAdmin from "../axios/axiosAdmin";

import type {
  VehicleReturn,
  CreateVehicleReturnRequest,
  PaginationResponse,
  VehicleReturnFilterParams, // Thêm type filter đã định nghĩa từ bài trước
} from "@repo/types";

export const vehicleReturnAdminApi = {
  // 1. Tạo biên bản trả xe (Multipart Form Data)
  async createVehicleReturn(payload: CreateVehicleReturnRequest) {
    const formData = new FormData();

    formData.append("bookingId", payload.bookingId);
    formData.append("returnBranchId", payload.returnBranchId);
    formData.append("conditionStatus", payload.conditionStatus);

    if (payload.damageDescription) {
      formData.append("damageDescription", payload.damageDescription);
    }
    if (payload.extraFee !== undefined) {
      formData.append("extraFee", String(payload.extraFee));
    }
    if (payload.returnOdometerReading !== undefined) {
      formData.append(
        "returnOdometerReading",
        String(payload.returnOdometerReading),
      );
    }
    if (payload.notes) {
      formData.append("notes", payload.notes);
    }

    formData.append("employeeId", payload.employeeId);

    payload.images?.forEach((file) => {
      formData.append("images", file);
    });

    // 🟢 SỬA TẠI ĐÂY: Chỉ cần truyền 1 generic đơn <VehicleReturn>
    // Vì interceptor đã tự động unwrap AxiosResponse về dạng dữ liệu thô (result)
    const data = await axiosAdmin.post<VehicleReturn, VehicleReturn>(
      "/bookings/returns",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return {
      message: "Trả xe thành công",
      vehicleReturn: data, // data lúc này chính xác là kiểu VehicleReturn
    };
  },

  // 2. Lấy chi tiết biên bản theo Booking ID
  async getVehicleReturnByBookingId(bookingId: string) {
    // Interceptor tự unwrap data.result về kiểu VehicleReturn
    return axiosAdmin.get<VehicleReturn, VehicleReturn>(
      `/bookings/returns/booking/${bookingId}`,
    );
  },

  // 3. Lấy TOÀN BỘ danh sách (Dành cho siêu Admin hệ thống)
  async getVehicleReturnAll(page = 1, size = 10) {
    return axiosAdmin.get<
      PaginationResponse<VehicleReturn[]>,
      PaginationResponse<VehicleReturn[]>
    >("/bookings/returns/all", {
      params: { page, size },
    });
  },

  // 4. Lấy danh sách giới hạn theo chi nhánh của nhân viên đang login
  async getVehicleReturnsPerBranch(page = 1, size = 10) {
    return axiosAdmin.get<
      PaginationResponse<VehicleReturn[]>,
      PaginationResponse<VehicleReturn[]>
    >("/bookings/returns", {
      params: { page, size },
    });
  },

  // 5. Bộ lọc tìm kiếm nâng cao (Dành cho cả Admin lẫn Employee)
  async filterVehicleReturns(filters: VehicleReturnFilterParams) {
    return axiosAdmin.get<
      PaginationResponse<VehicleReturn[]>,
      PaginationResponse<VehicleReturn[]>
    >("/bookings/returns/filter", {
      params: {
        page: 1,
        size: 10,
        ...filters,
      },
    });
  },
};
