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
import { updateBranchSchema } from "@repo/schemas";
import type { UpdateBranchPayload, Branch } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
};

export default function BranchEdit({ open, onOpenChange, branch }: Props) {
  const { mutateAsync, isPending } = useUpdateBranch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateBranchPayload>({
    resolver: zodResolver(updateBranchSchema),
  });

  useEffect(() => {
    if (!branch) return;
    reset({
      name: branch.name,
      address: branch.address,
      lat: branch.lat,
      lng: branch.lng,
      status: branch.status,
    });
  }, [branch, reset]);

  const onSubmit = async (values: UpdateBranchPayload) => {
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
            <FieldLabel>Địa chỉ</FieldLabel>
            <Input {...register("address")} />
            {errors.address && (
              <FieldError>{errors.address.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Latitude</FieldLabel>
            <Input {...register("lat")} />
            {errors.lat && <FieldError>{errors.lat.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Longitude</FieldLabel>
            <Input {...register("lng")} />
            {errors.lng && <FieldError>{errors.lng.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Trạng thái</FieldLabel>
            <Input {...register("status")} />
            {errors.status && <FieldError>{errors.status.message}</FieldError>}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
