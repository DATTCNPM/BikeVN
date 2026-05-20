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

import { useUpdateBooking } from "@/features/bookings/mutations";
import { bookingAdminSchema, type BookingAdminFormValues } from "@/features/bookings/schemas";
import type { Booking } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
};

export default function BookingEdit({ open, onOpenChange, booking }: Props) {
  const { mutateAsync, isPending } = useUpdateBooking();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingAdminFormValues>({
    resolver: zodResolver(bookingAdminSchema),
  });

  useEffect(() => {
    if (!booking) return;
    reset({
      user_id: booking.user_id,
      vehicle_id: booking.vehicle_id,
      pickup_branch_id: booking.pickup_branch_id,
      return_branch_id: booking.return_branch_id,
      start_date: booking.start_date.substring(0, 16),
      end_date: booking.end_date.substring(0, 16),
      total_price: booking.total_price,
      status: booking.status,
    });
  }, [booking, reset]);

  const onSubmit = async (values: BookingAdminFormValues) => {
    if (!booking) return;
    try {
      await mutateAsync({ id: booking.id, payload: values });
      toast.success("Cập nhật đơn đặt xe thành công");
      onOpenChange(false);
    } catch {
      toast.error("Cập nhật đơn đặt xe thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Chỉnh sửa đơn đặt xe"
      description="Cập nhật thông tin đơn"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Lưu thay đổi"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup className="sm:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>User ID</FieldLabel>
              <Input {...register("user_id")} />
              {errors.user_id && <FieldError>{errors.user_id.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Vehicle ID</FieldLabel>
              <Input {...register("vehicle_id")} />
              {errors.vehicle_id && <FieldError>{errors.vehicle_id.message}</FieldError>}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Chi nhánh nhận</FieldLabel>
              <Input {...register("pickup_branch_id")} />
              {errors.pickup_branch_id && <FieldError>{errors.pickup_branch_id.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Chi nhánh trả</FieldLabel>
              <Input {...register("return_branch_id")} />
              {errors.return_branch_id && <FieldError>{errors.return_branch_id.message}</FieldError>}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Ngày nhận</FieldLabel>
              <Input type="datetime-local" {...register("start_date")} />
              {errors.start_date && <FieldError>{errors.start_date.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Ngày trả</FieldLabel>
              <Input type="datetime-local" {...register("end_date")} />
              {errors.end_date && <FieldError>{errors.end_date.message}</FieldError>}
            </Field>
          </div>

          <Field>
            <FieldLabel>Tổng tiền</FieldLabel>
            <Input type="number" {...register("total_price", { valueAsNumber: true })} />
            {errors.total_price && <FieldError>{errors.total_price.message}</FieldError>}
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
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <FieldError>{errors.status.message}</FieldError>}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
