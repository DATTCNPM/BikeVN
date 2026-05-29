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

import { useCreateBranch } from "@/features/branches/mutations";
import {
  branchSchema,
  type BranchFormValues,
} from "@/features/branches/schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: BranchFormValues = {
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
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues,
  });

  const onSubmit = async (values: BranchFormValues) => {
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
            <Input {...register("address")} placeholder="123 ABC" />
            {errors.address && (
              <FieldError>{errors.address.message}</FieldError>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Vĩ độ (Lat)</FieldLabel>
              <Input
                type="number"
                step="any"
                {...register("lat", { valueAsNumber: true })}
              />
              {errors.lat && <FieldError>{errors.lat.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Kinh độ (Lng)</FieldLabel>
              <Input
                type="number"
                step="any"
                {...register("lng", { valueAsNumber: true })}
              />
              {errors.lng && <FieldError>{errors.lng.message}</FieldError>}
            </Field>
          </div>

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
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
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
