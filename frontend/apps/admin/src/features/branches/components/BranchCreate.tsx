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
import { vehicleBrandCreationSchema } from "@repo/schemas";
import type { VehicleBrandCreationRequest } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: VehicleBrandCreationRequest = {
  name: "",

  country: "",
};

export default function BranchCreate({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreateBranch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleBrandCreationRequest>({
    resolver: zodResolver(vehicleBrandCreationSchema),
    defaultValues,
  });

  const onSubmit = async (values: VehicleBrandCreationRequest) => {
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
            <FieldLabel>Quốc gia</FieldLabel>
            <Input {...register("country")} placeholder="Việt Nam" />
            {errors.country && (
              <FieldError>{errors.country.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
