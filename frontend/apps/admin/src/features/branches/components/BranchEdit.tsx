import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
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
import type { UpdateBranchPayload, Branch, BranchStatus } from "@repo/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { handleFormBackendError } from "@repo/providers";
import { isApiError } from "@repo/api";

const StatusOptions: BranchStatus[] = ["active", "inactive"];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
};

export default function BranchEdit({ open, onOpenChange, branch }: Props) {
  const { mutate: updateBranch, isPending } = useUpdateBranch(); // 🌟 Đổi từ mutateAsync sang mutate

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError, // 🌟 Lấy ra để map lỗi backend
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

  const onSubmit = (values: UpdateBranchPayload) => {
    if (!branch) return;

    updateBranch(
      { id: branch.id, payload: values },
      {
        onSuccess: () => {
          toast.success("Branch updated successfully");
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          // 🌟 Tự động bắt lỗi cập nhật (ví dụ sửa tên trùng với chi nhánh khác)
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
      title="Edit Branch"
      description="Update branch information"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Save Changes"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Address</FieldLabel>
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
            <FieldLabel>Status</FieldLabel>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {StatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <FieldError>{errors.status.message}</FieldError>}
          </Field>
        </FieldGroup>
      </div>
    </UniversalDialog>
  );
}
