// src/apis/paymentApi.ts

import { payments } from "../data/PaymentData";

import type { Payment, PaymentMethod, PaymentStatus } from "@repo/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type CreatePaymentPayload = {
  booking_id: string;
  amount: number;
  type: Payment["type"];
  card_method: PaymentMethod;
  payment_method: PaymentMethod;
  status?: PaymentStatus;
  transaction_code?: string | null;
  paid_at?: string | null;
};

export type UpdatePaymentPayload = Partial<CreatePaymentPayload>;

export const paymentApi = {
  async getPayments(): Promise<Payment[]> {
    await delay(500);

    return payments;
  },

  async getPaymentById(id: string): Promise<Payment> {
    await delay(300);

    const payment = payments.find((p) => p.id === id);

    if (!payment) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Thanh toán không tồn tại",
          },
        },
      };
    }

    return payment;
  },

  async getPaymentsByBookingId(bookingId: string): Promise<Payment[]> {
    await delay(300);

    return payments.filter((p) => p.booking_id === bookingId);
  },

  async createPayment(
    payload: CreatePaymentPayload,
  ): Promise<{ message: string; payment: Payment }> {
    await delay(500);

    const newPayment: Payment = {
      id: crypto.randomUUID(),

      booking_id: payload.booking_id,

      amount: payload.amount,

      type: payload.type,

      card_method: payload.card_method,

      payment_method: payload.payment_method,

      status: payload.status || "pending",

      transaction_code: payload.transaction_code || null,

      paid_at: payload.paid_at || null,

      created_at: new Date().toISOString(),
    };

    payments.push(newPayment);

    return {
      message: "Tạo thanh toán thành công",

      payment: newPayment,
    };
  },

  async updatePayment(
    id: string,
    payload: UpdatePaymentPayload,
  ): Promise<{ message: string; payment: Payment }> {
    await delay(500);

    const paymentIndex = payments.findIndex((p) => p.id === id);

    if (paymentIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Thanh toán không tồn tại",
          },
        },
      };
    }

    payments[paymentIndex] = {
      ...payments[paymentIndex],

      ...payload,
    };

    return {
      message: "Cập nhật thanh toán thành công",

      payment: payments[paymentIndex],
    };
  },

  async deletePayment(id: string): Promise<{ message: string }> {
    await delay(500);

    const paymentIndex = payments.findIndex((p) => p.id === id);

    if (paymentIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Thanh toán không tồn tại",
          },
        },
      };
    }

    payments.splice(paymentIndex, 1);

    return {
      message: "Xóa thanh toán thành công",
    };
  },
};
