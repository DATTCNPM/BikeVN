import axiosAdmin from "../axios/axiosAdmin";

import type { VehicleReturn, CreateVehicleReturnRequest } from "@repo/types";

export const vehicleReturnAdminApi = {
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

    const data = await axiosAdmin.post<
      VehicleReturn,
      CreateVehicleReturnRequest
    >("/bookings/return", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      message: "Trả xe thành công",
      vehicleReturn: data,
    };
  },

  async getVehicleReturnByBookingId(bookingId: string) {
    return axiosAdmin.get<VehicleReturn, VehicleReturn>(
      `/bookings/return/booking/${bookingId}`,
    );
  },
};
