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

  // Đồng bộ employeeId khi dữ liệu profile tải xong nhằm vượt qua kiểm tra UUID của Zod
  useEffect(() => {
    if (profile?.id) {
      setValue("employeeId", profile.id, { shouldValidate: true });
    }
  }, [profile, setValue]);

  // Đồng bộ lại bookingId nếu component được tái sử dụng cho booking khác
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

      // Reset form về trạng thái ban đầu sạch sẽ kèm theo ID nhân viên hiện tại
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
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Booking ID</FieldLabel>
          <input type="hidden" {...register("bookingId")} />
          <Input value={bookingId} disabled />
        </Field>

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

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Current Odometer Reading</FieldLabel>

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
            <FieldLabel>Extra Fee</FieldLabel>

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
          <FieldLabel>Damage Description</FieldLabel>

          <Textarea
            {...register("damageDescription")}
            placeholder="Describe vehicle condition..."
          />
        </Field>

        <Field>
          <FieldLabel>Notes</FieldLabel>

          <Textarea
            {...register("notes")}
            placeholder="Additional information..."
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Confirming Employee</FieldLabel>

            <input type="hidden" {...register("employeeId")} />
            <Input value={profile?.name || ""} disabled />
          </Field>

          <Field>
            <FieldLabel>Images</FieldLabel>

            <ImageUploadField
              multiple
              value={images}
              onChange={(files) =>
                setValue("images", files, {
                  shouldValidate: true,
                })
              }
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
