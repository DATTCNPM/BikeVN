import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";
import { Input } from "@repo/ui/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { toast } from "@repo/ui/components/ui/sonner";

import { useUpdateBranch } from "@/features/branches/mutations";
import { vehicleBrandUpdateSchema } from "@repo/schemas";
import type { VehicleBrandUpdateRequest, VehicleBrand } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: VehicleBrand | null;
};

export default function BranchEdit({ open, onOpenChange, branch }: Props) {
  const { mutateAsync, isPending } = useUpdateBranch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleBrandUpdateRequest>({
    resolver: zodResolver(vehicleBrandUpdateSchema),
  });

  useEffect(() => {
    if (!branch) return;
    reset({
      name: branch.name,
      country: branch.country,
    });
  }, [branch, reset]);

  const onSubmit = async (values: VehicleBrandUpdateRequest) => {
    if (!branch) return;
    try {
      await mutateAsync({ id: branch.id, payload: values });
      toast.success("Cập nhật chi nhánh thành công");
      onOpenChange(false);
    } catch {
      toast.error("Cập nhật chi nhánh thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Chỉnh sửa chi nhánh"
      description="Cập nhật thông tin chi nhánh"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Lưu thay đổi"
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Tên chi nhánh</FieldLabel>
            <Input {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Quốc gia</FieldLabel>
            <Input {...register("country")} />
            {errors.country && (
              <FieldError>{errors.country.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
