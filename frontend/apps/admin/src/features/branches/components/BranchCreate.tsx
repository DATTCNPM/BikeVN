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
import { useCreateBranch } from "@/features/branches/mutations";
import { createBranchSchema } from "@repo/schemas";
import type { CreateBranchPayload, BranchStatus } from "@repo/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { handleFormBackendError } from "@repo/providers"; // 🌟 Import helper dùng chung
import { isApiError } from "@repo/api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const StatusOptions: BranchStatus[] = ["active", "inactive"];

const defaultValues: CreateBranchPayload = {
  name: "",
  address: "",
  lat: 0,
  lng: 0,
  status: "active",
};

export default function BranchCreate({ open, onOpenChange }: Props) {
  const { mutate: createBranch, isPending } = useCreateBranch(); // 🌟 Đổi sang dùng mutate đồng bộ dữ liệu

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError, // 🌟 Lấy ra để map lỗi backend
    formState: { errors },
  } = useForm<CreateBranchPayload>({
    resolver: zodResolver(createBranchSchema),
    defaultValues,
  });

  const onSubmit = (values: CreateBranchPayload) => {
    createBranch(values, {
      onSuccess: () => {
        toast.success("Branch created successfully");
        reset(defaultValues);
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        // 🌟 TỰ ĐỘNG hoàn toàn: Trùng tên (1009) -> thông báo lỗi nhảy trực tiếp vào Input "Name"
        handleFormBackendError(error, setError, isApiError);
      },
    });
  };

  return (
    <UniversalDialog
      type="form"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Branch"
      description="Create a new branch in the system"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create Branch"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input {...register("name")} placeholder="Branch 1" />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Address</FieldLabel>
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
