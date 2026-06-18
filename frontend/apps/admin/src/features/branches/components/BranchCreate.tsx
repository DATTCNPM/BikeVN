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
      toast.success("Branch created successfully");
      reset(defaultValues);
      onOpenChange(false);
    } catch {
      toast.error("Failed to create branch");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Branch"
      description="Create a new branch in the system"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Create Branch"
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
            <Input {...register("status")} placeholder="active" />
            {errors.status && <FieldError>{errors.status.message}</FieldError>}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
