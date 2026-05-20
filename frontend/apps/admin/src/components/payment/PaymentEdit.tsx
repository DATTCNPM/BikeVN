import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { toast } from "@repo/ui/components/ui/sonner";

import { useUpdatePayment } from "@/features/payments/mutations";
import { paymentSchema, type PaymentFormValues } from "@/features/payments/schemas";
import type { Payment } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
};

export default function PaymentEdit({ open, onOpenChange, payment }: Props) {
  const { mutateAsync, isPending } = useUpdatePayment();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  useEffect(() => {
    if (!payment) return;
    reset({
      booking_id: payment.booking_id,
      amount: payment.amount,
      type: payment.type,
      card_method: payment.card_method,
      payment_method: payment.payment_method,
      status: payment.status,
      transaction_code: payment.transaction_code,
      paid_at: payment.paid_at ? payment.paid_at.substring(0, 16) : "",
    });
  }, [payment, reset]);

  const onSubmit = async (values: PaymentFormValues) => {
    if (!payment) return;
    try {
      await mutateAsync({ id: payment.id, payload: values });
      toast.success("Cập nhật thanh toán thành công");
      onOpenChange(false);
    } catch {
      toast.error("Cập nhật thanh toán thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Chỉnh sửa thanh toán"
      description="Cập nhật thông tin thanh toán"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Lưu thay đổi"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup className="sm:col-span-2">
          <Field>
            <FieldLabel>Mã đơn đặt xe (Booking ID)</FieldLabel>
            <Input {...register("booking_id")} />
            {errors.booking_id && <FieldError>{errors.booking_id.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Số tiền</FieldLabel>
            <Input type="number" {...register("amount", { valueAsNumber: true })} />
            {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Loại thanh toán</FieldLabel>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Đặt cọc</SelectItem>
                      <SelectItem value="rental">Thuê xe</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <FieldError>{errors.type.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Trạng thái</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                      <SelectItem value="failed">Thất bại</SelectItem>
                      <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <FieldError>{errors.status.message}</FieldError>}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Phương thức</FieldLabel>
              <Controller
                control={control}
                name="payment_method"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="momo">Momo</SelectItem>
                      <SelectItem value="vnpay">VNPay</SelectItem>
                      <SelectItem value="card">Thẻ</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.payment_method && <FieldError>{errors.payment_method.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Thẻ / App</FieldLabel>
              <Controller
                control={control}
                name="card_method"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="momo">Momo</SelectItem>
                      <SelectItem value="vnpay">VNPay</SelectItem>
                      <SelectItem value="card">Thẻ ngân hàng</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.card_method && <FieldError>{errors.card_method.message}</FieldError>}
            </Field>
          </div>

          <Field>
            <FieldLabel>Mã giao dịch</FieldLabel>
            <Input {...register("transaction_code")} />
            {errors.transaction_code && <FieldError>{errors.transaction_code.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Thời gian thanh toán</FieldLabel>
            <Input type="datetime-local" {...register("paid_at")} />
            {errors.paid_at && <FieldError>{errors.paid_at.message}</FieldError>}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
