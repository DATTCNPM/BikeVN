import axiosPublic from "../axios/axiosPublic";
import type {
  Vehicle,
  VehicleQueryParams,
  PaginationResponse,
} from "@repo/types";

// URL ảnh mock chất lượng cao để web trông chuyên nghiệp hơn khi chưa có ảnh thật
const MOCK_VEHICLE_IMAGE = "https://images.unsplash.com/photo-1558981403-c5f91ebce068?q=80&w=1000&auto=format&fit=crop";

export const vehiclePublicApi = {
  async getVehicles(page: number, size: number) {
    const res = await axiosPublic.get<
      PaginationResponse<Vehicle>,
      PaginationResponse<Vehicle>
    >("/vehicles", {
      params: { page, size },
    });

    // MOCK ẢNH: Ghi đè ảnh cho toàn bộ danh sách xe trả về từ DB
    if (res.data) {
      res.data = res.data.map(vehicle => ({
        ...vehicle,
        images: [{ id: "mock-img", imageUrl: MOCK_VEHICLE_IMAGE, isPrimary: true }]
      }));
    }
    
    return res;
  },

  async getVehicleById(id: string) {
    const vehicle = await axiosPublic.get<Vehicle, Vehicle>(`/vehicles/${id}`);
    
    // MOCK ẢNH: Ghi đè ảnh cho chi tiết xe trả về từ DB
    return {
      ...vehicle,
      images: [{ id: "mock-img", imageUrl: MOCK_VEHICLE_IMAGE, isPrimary: true }]
    };
  },

  async getVehicleFilters(params?: VehicleQueryParams) {
    const res = await axiosPublic.get<
      PaginationResponse<Vehicle>,
      PaginationResponse<Vehicle>
    >("/vehicles/filter", {
      params,
    });

    // MOCK ẢNH: Ghi đè ảnh cho kết quả lọc trả về từ DB
    if (res.data) {
      res.data = res.data.map(vehicle => ({
        ...vehicle,
        images: [{ id: "mock-img", imageUrl: MOCK_VEHICLE_IMAGE, isPrimary: true }]
      }));
    }

    return res;
  },
};
