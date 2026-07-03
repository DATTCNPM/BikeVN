import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
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

import { useUpdateEmployee } from "@/features/employees/mutationEmployee";
import { useBranches } from "@repo/hooks";
import { updateEmployeeSchema } from "@repo/schemas";
import type { UpdateEmployeePayload, Employee } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Employee | null;
};

export default function EmployeeEdit({ open, onOpenChange, user }: Props) {
  const { mutateAsync, isPending } = useUpdateEmployee();
  const { data: branches } = useBranches();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateEmployeePayload>({
    resolver: zodResolver(updateEmployeeSchema),
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      cccdNumber: user.cccdNumber || "",
      branchId: user.branchId || "",
    });
  }, [user, reset]);

  const onSubmit = async (values: UpdateEmployeePayload) => {
    if (!user) return;
    try {
      await mutateAsync({ id: user.id, payload: values });
      toast.success("Update employee successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update employee");
    }
  };

  return (
    <UniversalDialog
      type="form"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Employee"
      description="Update employee information"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Save Changes"
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input {...register("email")} type="email" />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <Input {...register("phone")} />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>CCCD</FieldLabel>
            <Input {...register("cccdNumber")} />
            {errors.cccdNumber && (
              <FieldError>{errors.cccdNumber.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Branch</FieldLabel>
            <Controller
              control={control}
              name="branchId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches?.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.branchId && (
              <FieldError>{errors.branchId.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </div>
    </UniversalDialog>
  );
}
