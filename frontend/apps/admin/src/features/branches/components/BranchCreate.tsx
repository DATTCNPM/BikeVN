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

import { useCreateBranch } from "@/features/branches/mutations";
import { createBranchSchema } from "@repo/schemas";
import type { CreateBranchPayload } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: CreateBranchPayload = {
  name: "",

  address: "",

  lat: 0,

  lng: 0,

  status: "active",
};

export default function BranchCreate({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreateBranch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBranchPayload>({
    resolver: zodResolver(createBranchSchema),
    defaultValues,
  });

  const onSubmit = async (values: CreateBranchPayload) => {
    console.log("Submitting branch creation with values:", values);
    try {
      await mutateAsync(values);
      toast.success("Tạo chi nhánh thành công");
      reset(defaultValues);
      onOpenChange(false);
    } catch {
      toast.error("Tạo chi nhánh thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm chi nhánh"
      description="Tạo chi nhánh mới trong hệ thống"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Tạo"
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Tên chi nhánh</FieldLabel>
            <Input {...register("name")} placeholder="Chi nhánh 1" />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Địa chỉ</FieldLabel>
            <Input
              {...register("address")}
              placeholder="123 Đường ABC, Quận XYZ"
            />
            {errors.address && (
              <FieldError>{errors.address.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Latitude</FieldLabel>
            <Input {...register("lat")} placeholder="10.7754" />
            {errors.lat && <FieldError>{errors.lat.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Longitude</FieldLabel>
            <Input {...register("lng")} placeholder="106.6626" />
            {errors.lng && <FieldError>{errors.lng.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Trạng thái</FieldLabel>
            <Input {...register("status")} placeholder="active" />
            {errors.status && <FieldError>{errors.status.message}</FieldError>}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
