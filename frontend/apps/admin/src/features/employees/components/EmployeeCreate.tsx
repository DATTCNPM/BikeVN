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

import { useCreateEmployee } from "@/features/employees/mutationEmployee";
import { adminEmployeeCreationSchema } from "@repo/schemas";
import type { AdminEmployeeCreationPayload } from "@repo/types";
import { useBranches } from "@repo/hooks";

import { handleFormBackendError } from "@repo/providers";
import { isApiError } from "@repo/api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: AdminEmployeeCreationPayload = {
  name: "",
  email: "",
  passwordHash: "",
  phone: "",
  cccdNumber: "",
  branchId: "",
};

export default function EmployeeCreate({ open, onOpenChange }: Props) {
  const { mutate: createEmployee, isPending } = useCreateEmployee();
  const { data: branches } = useBranches();

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<AdminEmployeeCreationPayload>({
    resolver: zodResolver(adminEmployeeCreationSchema),
    defaultValues,
  });

  const onSubmit = (values: AdminEmployeeCreationPayload) => {
    createEmployee(values, {
      onSuccess: () => {
        toast.success("Employee created successfully");
        reset(defaultValues);
        onOpenChange(false);
      },
      onError: (error: unknown) => {
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
      title="Create Employee"
      description="Create a new employee in the system"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create Employee"
      error={errors.root?.message} // 🌟 Hiển thị lỗi chung hệ thống (mất mạng, concurrency, code 9999, 5050) nếu có
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input {...register("name")} placeholder="John Doe" />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              {...register("passwordHash")}
              type="password"
              placeholder="********"
            />
            {errors.passwordHash && (
              <FieldError>{errors.passwordHash.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <Input {...register("phone")} placeholder="0901234567" />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>CCCD</FieldLabel>
            <Input {...register("cccdNumber")} placeholder="079203000123" />
            {errors.cccdNumber && (
              <FieldError>{errors.cccdNumber.message}</FieldError>
            )}
          </Field>

          <Controller
            control={control}
            name="branchId"
            render={({ field }) => (
              <Field>
                <FieldLabel>Branch</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches?.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branchId && (
                  <FieldError>{errors.branchId.message}</FieldError>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>
    </UniversalDialog>
  );
}
