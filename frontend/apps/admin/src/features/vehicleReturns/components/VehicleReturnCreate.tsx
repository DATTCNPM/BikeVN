import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import { Input } from "@repo/ui/components/ui/input";

import { Textarea } from "@repo/ui/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

import { toast } from "@repo/ui/components/ui/sonner";

import { useBranches } from "@repo/hooks";

import { useCreateVehicleReturn } from "@/features/vehicleReturns/vehicleReturnMutations";

import { createVehicleReturnSchema } from "@repo/schemas";

import type {
  CreateVehicleReturnRequest,
  VehicleConditionStatus,
} from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
};

export default function VehicleReturnCreate({
  open,
  onOpenChange,
  bookingId,
}: Props) {
  const { mutateAsync, isPending } = useCreateVehicleReturn();

  const { data: branches = [] } = useBranches();

  const defaultValues: CreateVehicleReturnRequest = {
    bookingId,
    returnBranchId: "",

    conditionStatus: "excellent" as VehicleConditionStatus,

    damageDescription: "",

    extraFee: 0,

    images: [],

    returnOdometerReading: 0,

    notes: "",

    employeeId: "",
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateVehicleReturnRequest>({
    resolver: zodResolver(createVehicleReturnSchema),
    defaultValues,
  });

  const onSubmit = async (values: CreateVehicleReturnRequest) => {
    try {
      await mutateAsync(values);

      toast.success("Tạo phiếu trả xe thành công");

      reset(defaultValues);

      onOpenChange(false);
    } catch {
      toast.error("Tạo phiếu trả xe thất bại");
    }
  };

  console.log("render create dialog", open);

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tạo phiếu trả xe"
      description="Xác nhận tình trạng xe khi khách trả"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Xác nhận trả xe"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Mã booking</FieldLabel>

          <Input value={bookingId} disabled />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Chi nhánh trả xe</FieldLabel>

            <Controller
              control={control}
              name="returnBranchId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chi nhánh" />
                  </SelectTrigger>

                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.returnBranchId && (
              <FieldError>{errors.returnBranchId.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Tình trạng xe</FieldLabel>

            <Controller
              control={control}
              name="conditionStatus"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="GOOD">Bình thường</SelectItem>

                    <SelectItem value="MINOR_DAMAGE">Hư hỏng nhẹ</SelectItem>

                    <SelectItem value="MAJOR_DAMAGE">Hư hỏng nặng</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.conditionStatus && (
              <FieldError>{errors.conditionStatus.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Số km hiện tại</FieldLabel>

            <Input
              type="number"
              {...register("returnOdometerReading", {
                valueAsNumber: true,
              })}
            />

            {errors.returnOdometerReading && (
              <FieldError>{errors.returnOdometerReading.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Phí phát sinh</FieldLabel>

            <Input
              type="number"
              {...register("extraFee", {
                valueAsNumber: true,
              })}
            />

            {errors.extraFee && (
              <FieldError>{errors.extraFee.message}</FieldError>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel>Mô tả hư hỏng</FieldLabel>

          <Textarea
            {...register("damageDescription")}
            placeholder="Mô tả tình trạng xe..."
          />
        </Field>

        <Field>
          <FieldLabel>Ghi chú</FieldLabel>

          <Textarea {...register("notes")} placeholder="Thông tin bổ sung..." />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Nhân viên xác nhận</FieldLabel>

            <Input {...register("employeeId")} placeholder="Nhập employee id" />

            {errors.employeeId && (
              <FieldError>{errors.employeeId.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Hình ảnh</FieldLabel>

            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);

                setValue("images", files, {
                  shouldValidate: true,
                });
              }}
            />

            {errors.images && (
              <FieldError>{errors.images.message as string}</FieldError>
            )}
          </Field>
        </div>
      </FieldGroup>
    </EntityFormDialog>
  );
}
