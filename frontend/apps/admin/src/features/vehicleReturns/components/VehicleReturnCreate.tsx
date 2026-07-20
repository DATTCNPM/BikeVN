import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
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
import { useCreateVehicleReturn } from "@/features/vehicleReturns/hooks/vehicleReturnMutations";

import {
  createVehicleReturnSchema,
  vehicleConditionStatusSchema,
} from "@repo/schemas";

import type { CreateVehicleReturnRequest } from "@repo/schemas";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";

// 🌟 Import helper check error từ Packages hệ thống giống trang Login
import { isApiError } from "@repo/api";
import { handleFormBackendError } from "@repo/providers";

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
  const { mutate: createReturn, isPending } = useCreateVehicleReturn();
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
    paymentMethod: "bank_transfer",
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
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

  const onSubmit = (values: CreateVehicleReturnRequest) => {
    createReturn(
      {
        ...values,
        employeeId: profile?.id || values.employeeId,
        paymentMethod: "bank_transfer",
      },
      {
        onSuccess: () => {
          toast.success("Create vehicle return successfully");
          reset({
            ...defaultValues,
            employeeId: profile?.id || "",
          });
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          handleFormBackendError(error, setError, isApiError);
        },
      },
    );
  };

  return (
    <UniversalDialog
      type="form"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Create Vehicle Return"
      description="Confirm vehicle condition when customer returns"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Confirm Return"
      error={errors.root?.message}
    >
      <FieldGroup className="space-y-5">
        {/* Hàng 1: Thông tin cố định hệ thống */}
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Booking ID</FieldLabel>
            <input type="hidden" {...register("bookingId")} />
            <Input value={bookingId} disabled className="bg-muted" />
            {errors.bookingId && (
              <FieldError>{errors.bookingId.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Confirming Employee</FieldLabel>
            <input type="hidden" {...register("employeeId")} />
            <Input value={profile?.name || ""} disabled className="bg-muted" />
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

        {/* Hàng 5: Khu vực Upload ảnh */}
        <Field className="border-t pt-4">
          <FieldLabel>Images Documentation</FieldLabel>
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
    </UniversalDialog>
  );
}
