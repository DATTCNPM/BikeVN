import axiosClient from "../axios/axiosClient";

import type {  Payment } from "@repo/types";

export const paymentCommonApi = {
  async getPayment(id: string) {
    const data = await axiosClient.get<Payment>(
      `/payments/${id}`,
    );

    if (!data) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Thanh toán không tồn tại",
          },
        },
      };
    }

    return data;
  },
};
