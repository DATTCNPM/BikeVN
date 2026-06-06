import axiosClient from "../axios/axiosClient";

import type { ApiResponse, Payment } from "@repo/types";

export const paymentCommonApi = {
  async getPayment(id: string): Promise<Payment> {
    const data = await axiosClient.get<any, ApiResponse<Payment>>(
      `/payments/${id}`,
    );

    if (!data.result) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Thanh toán không tồn tại",
          },
        },
      };
    }

    return data.result;
  },
};
