import { Payment } from "@repo/types";
import axiosAdmin from "../axios/axiosAdmin";

export const paymentAdminApi = {
  async getAllPayments(){
    const data = await axiosAdmin.get<Payment[]>("/payments");
    return data || [];
  },

  async confirmPayment(id: string, transactionCode: string){
    await axiosAdmin.post(`/payments/${id}/confirm`, null, {
      params: {
        transactionCode,
      },
    });
  },
};
