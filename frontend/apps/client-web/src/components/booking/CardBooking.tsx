import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDays, differenceInDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import type { DateRange } from "react-day-picker";

import { toast } from "sonner";

import { Badge } from "@repo/ui/components/ui/badge";

import { Button } from "@repo/ui/components/ui/button";

import { Calendar } from "@repo/ui/components/ui/calendar";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

import { Separator } from "@repo/ui/components/ui/separator";

import { Spinner } from "@repo/ui/components/ui/spinner";

import { useCreateBooking } from "@/hooks/useBooking";

import { useVehicle } from "@/hooks/useVehicle";
import { useBranches } from "@/hooks/useBranch";

import type { BookingSchema } from "@repo/schemas";
import { bookingSchema } from "@repo/schemas";

export default function BookingCard() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { mutate: createBooking, error, isPending } = useCreateBooking();

  const { data: vehicle = null, isLoading: vehicleLoading } = useVehicle(id!);
  const { data: branches = [], isLoading: branchLoading } = useBranches();

  const form = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),

    defaultValues: {
      pickupBranchId: "",

      returnBranchId: "",

      dateRange: {
        from: new Date(),

        to: addDays(new Date(), 2),
      },
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Lấy thông tin xe thất bại");
    }
  }, [error]);

  if (branchLoading || vehicleLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const dateRange = form.watch("dateRange");

  const startDate = dateRange?.from;

  const endDate = dateRange?.to;

  const totalDays =
    startDate && endDate ? differenceInDays(endDate, startDate) || 1 : 0;

  const totalPrice = totalDays * (vehicle?.price_per_day || 0);

  const onSubmit = (values: BookingSchema) => {
    createBooking({
      user_id: "u1", // mock user
      vehicle_id: id!,
      pickup_branch_id: values.pickupBranchId,
      return_branch_id: values.returnBranchId,
      start_date: values.dateRange.from.toISOString(),
      end_date: values.dateRange.to.toISOString(),
      total_price: totalPrice,
    });

    navigate("/payment/booking-1");
  };

  const branchOptions = branches?.map((branch) => ({
    label: branch.name,
    value: branch.id,
  }));

  return (
    <Card className="sticky top-24 w-full rounded-3xl">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Giá thuê</p>

            <CardTitle className="text-3xl font-bold">
              {vehicle?.price_per_day?.toLocaleString("vi-VN") || "0"}đ
              <span className="ml-1 text-base font-normal text-muted-foreground">
                / ngày
              </span>
            </CardTitle>
          </div>

          <Badge className="rounded-full">Available</Badge>
        </div>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <Controller
            control={form.control}
            name="dateRange"
            render={({ field, fieldState }) => (
              <Field>
                <FieldGroup>
                  <FieldLabel>Thời gian thuê</FieldLabel>

                  <FieldContent>
                    <div className="overflow-hidden rounded-2xl border">
                      <Calendar
                        mode="range"
                        numberOfMonths={2}
                        selected={field.value as DateRange}
                        onSelect={(value) => field.onChange(value)}
                        defaultMonth={field.value.from}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        className="w-full"
                      />
                    </div>
                  </FieldContent>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </FieldGroup>
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4 rounded-2xl border p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ngày nhận xe</p>

              <p className="font-medium">
                {startDate
                  ? format(startDate, "dd/MM/yyyy", {
                      locale: vi,
                    })
                  : "--"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ngày trả xe</p>

              <p className="font-medium">
                {endDate
                  ? format(endDate, "dd/MM/yyyy", {
                      locale: vi,
                    })
                  : "--"}
              </p>
            </div>
          </div>

          <Controller
            control={form.control}
            name="pickupBranchId"
            render={({ field, fieldState }) => (
              <Field>
                <FieldGroup>
                  <FieldLabel>Nơi nhận xe</FieldLabel>

                  <FieldContent>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 rounded-2xl">
                        <SelectValue placeholder="Chọn nơi nhận xe" />
                      </SelectTrigger>

                      <SelectContent>
                        {branchOptions?.map((branch) => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </FieldGroup>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="returnBranchId"
            render={({ field, fieldState }) => (
              <Field>
                <FieldGroup>
                  <FieldLabel>Nơi trả xe</FieldLabel>

                  <FieldContent>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 rounded-2xl">
                        <SelectValue placeholder="Chọn nơi trả xe" />
                      </SelectTrigger>

                      <SelectContent>
                        {branchOptions?.map((branch) => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </FieldGroup>
              </Field>
            )}
          />

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Số ngày thuê</span>

              <span>{totalDays} ngày</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Giá mỗi ngày</span>

              <span>{vehicle?.price_per_day.toLocaleString("vi-VN")}đ</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Tổng tiền</span>

              <span className="text-2xl font-bold">
                {totalPrice.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-2xl text-base font-semibold"
          >
            {isPending ? "Đang xử lý..." : "Đặt xe ngay"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
