import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";

import EntityFormDialog from "@/components/common/EntityFormDialog";
import ImageUploadField from "@/components/common/ImageUploadField";

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

import {
  createVehicleReturnSchema,
  vehicleConditionStatusSchema,
} from "@repo/schemas";

import type { CreateVehicleReturnRequest } from "@repo/types";
import { usePortalProfile } from "@/features/auth/usePortalProfile";

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
  const { data: profile } = usePortalProfile();

  const defaultValues: CreateVehicleReturnRequest = {
    bookingId,
    returnBranchId: "",
    conditionStatus: "excellent",
    damageDescription: "",
    extraFee: 0,
    images: [],
    returnOdometerReading: 0,
    notes: "",
    employeeId: profile?.id || "",
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

  useEffect(() => {
    if (profile?.id) {
      setValue("employeeId", profile.id, { shouldValidate: true });
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (bookingId) {
      setValue("bookingId", bookingId);
    }
  }, [bookingId, setValue]);

  const images = useWatch({
    control,
    name: "images",
    defaultValue: [],
  });

  const onSubmit = async (values: CreateVehicleReturnRequest) => {
    try {
      await mutateAsync({
        ...values,
        employeeId: profile?.id || values.employeeId,
      });

      toast.success("create vehicle return successfully");

      reset({
        ...defaultValues,
        employeeId: profile?.id || "",
      });

      onOpenChange(false);
    } catch {
      toast.error("Failed to create vehicle return");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Vehicle Return"
      description="Confirm vehicle condition when customer returns"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Confirm Return"
      // MẸO: Bạn nên truyền className vào Content của Dialog thông qua component EntityFormDialog nếu nó hỗ trợ
      // className="max-w-3xl max-h-[85vh] flex flex-col"
    >
      {/* Bọc một lớp cuộn nội dung tự động nếu EntityFormDialog chưa có.
        Giúp nút Submit luôn hiển thị ở chân Dialog mà không bị đẩy mất.
      */}
      <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2">
        <FieldGroup className="space-y-5">
          {/* Hàng 1: Thông tin cố định hệ thống */}
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Booking ID</FieldLabel>
              <input type="hidden" {...register("bookingId")} />
              <Input value={bookingId} disabled className="bg-muted" />
            </Field>

            <Field>
              <FieldLabel>Confirming Employee</FieldLabel>
              <input type="hidden" {...register("employeeId")} />
              <Input
                value={profile?.name || ""}
                disabled
                className="bg-muted"
              />
            </Field>
          </div>

          {/* Hàng 2: Chi tiết trạng thái xe nhận về */}
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Return Branch</FieldLabel>
              <Controller
                control={control}
                name="returnBranchId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
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
              <FieldLabel>Vehicle Condition</FieldLabel>
              <Controller
                control={control}
                name="conditionStatus"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleConditionStatusSchema.options.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "excellent"
                            ? "Excellent"
                            : status === "good"
                              ? "Good"
                              : status === "fair"
                                ? "Fair"
                                : "Damaged"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.conditionStatus && (
                <FieldError>{errors.conditionStatus.message}</FieldError>
              )}
            </Field>
          </div>

          {/* Hàng 3: Chỉ số đo lường tài chính & vận hành */}
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Current Odometer Reading</FieldLabel>
              <Input
                type="number"
                {...register("returnOdometerReading", { valueAsNumber: true })}
              />
              {errors.returnOdometerReading && (
                <FieldError>{errors.returnOdometerReading.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Extra Fee</FieldLabel>
              <Input
                type="number"
                {...register("extraFee", { valueAsNumber: true })}
              />
              {errors.extraFee && (
                <FieldError>{errors.extraFee.message}</FieldError>
              )}
            </Field>
          </div>

          {/* Hàng 4: Các ghi chú dạng text */}
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Damage Description</FieldLabel>
              <Textarea
                {...register("damageDescription")}
                placeholder="Describe vehicle condition..."
                className="resize-none min-h-[80px]"
              />
            </Field>

            <Field>
              <FieldLabel>Notes</FieldLabel>
              <Textarea
                {...register("notes")}
                placeholder="Additional information..."
                className="resize-none min-h-[80px]"
              />
            </Field>
          </div>

          {/* Hàng 5: Khu vực Upload ảnh - Chiếm trọn 1 hàng lớn phía dưới cùng nội dung */}
          <Field className="border-t pt-4">
            <FieldLabel>Images Documentation</FieldLabel>
            {/* LƯU Ý: Phía bên trong `ImageUploadField`, bạn nên cấu hình vùng chứa ảnh preview 
              có `max-h-[150px] overflow-y-auto` hoặc hiển thị dạng grid thu nhỏ để không chiếm diện tích dọc.
            */}
            <div className="mt-1">
              <ImageUploadField
                multiple
                value={images}
                onChange={(files) =>
                  setValue("images", files, { shouldValidate: true })
                }
              />
            </div>
            {errors.images && (
              <FieldError>{errors.images.message as string}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
