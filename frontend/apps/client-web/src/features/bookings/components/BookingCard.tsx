import { useNavigate } from "react-router-dom";
import {
  addDays,
  differenceInDays,
  format,
  startOfDay,
  endOfDay,
} from "date-fns";
import { vi } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import type { DateRange } from "react-day-picker";

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

import { useCreateBooking } from "@/features/bookings/mutations";

import type { Branch, Vehicle } from "@repo/types";

import { bookingFormSchema } from "@repo/schemas";
import type { BookingFormValues } from "@repo/types";

import { useAuthStore } from "@/features/auth/authStore";
import { useProfile } from "@/features/profile/useProfile";
import { useEffect } from "react";

type Props = {
  vehicle: Vehicle;
  branches: Branch[];
};

export default function BookingCard({ vehicle, branches }: Props) {
  const navigate = useNavigate();

  const { isLogin } = useAuthStore();

  const { data: profile } = useProfile();

  const { mutate: createBooking, isPending } = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),

    defaultValues: {
      returnBranchId: "",

      dateRange: {
        from: startOfDay(addDays(new Date(), 1)),
        to: endOfDay(addDays(new Date(), 3)),
      },
    },
  });

  const dateRange = form.watch("dateRange");

  const startDate = dateRange?.from;

  const endDate = dateRange?.to;

  const totalDays =
    startDate && endDate
      ? Math.max(1, differenceInDays(endDate, startDate))
      : 0;

  const totalPrice = totalDays * (vehicle.pricePerDay ?? 0);

  const branchOptions = branches.map((branch) => ({
    label: branch.name,

    value: branch.id,
  }));

  useEffect(() => {
    const pendingBooking = localStorage.getItem("pending-booking");

    if (!pendingBooking) return;

    const booking = JSON.parse(pendingBooking);

    if (booking.vehicleId !== vehicle.id) return;

    form.reset({
      returnBranchId: booking.formData.returnBranchId,
      dateRange: {
        from: new Date(booking.formData.dateRange.from),
        to: new Date(booking.formData.dateRange.to),
      },
    });
    localStorage.removeItem("pending-booking");
  }, [vehicle.id]);

  const onSubmit = (values: BookingFormValues) => {
    if (!isLogin) {
      localStorage.setItem(
        "pending-booking",
        JSON.stringify({
          vehicleId: vehicle.id,
          formData: values,
        }),
      );

      navigate("/login");

      return;
    }
    console.log("Form values on submit:", values);
    const payload = {
      userId: profile?.id || "", // TODO: lấy từ auth
      vehicleId: vehicle.id,
      pickupBranchId: vehicle.currentBranchId,
      returnBranchId: values.returnBranchId,
      startTime: format(values.dateRange.from, "yyyy-MM-dd'T'HH:mm:ss"),
      endTime: format(values.dateRange.to, "yyyy-MM-dd'T'HH:mm:ss"),
    };
    createBooking(payload, {
      onSuccess: (booking) => {
        navigate(`/payment/${booking.id}`);
      },
    });
  };

  return (
    <Card className=" w-full rounded-3xl">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Giá thuê</p>

            <CardTitle className="text-3xl font-bold">
              {vehicle.pricePerDay.toLocaleString("vi-VN")}đ
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
                        onSelect={(value) => {
                          if (value?.from && value?.to) {
                            field.onChange(value);
                          }
                        }}
                        defaultMonth={field.value?.from}
                        disabled={(date) =>
                          date <= new Date(new Date().setHours(0, 0, 0, 0))
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

          <Field className="pt-0">
            <FieldGroup>
              <FieldLabel>Nơi nhận xe</FieldLabel>
              <FieldContent>
                <p>
                  {branches.find((b) => b.id === vehicle.currentBranchId)
                    ?.name || "--"}
                </p>
              </FieldContent>
            </FieldGroup>
          </Field>

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
                        {branchOptions.map((branch) => (
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

              <span>{vehicle.pricePerDay.toLocaleString("vi-VN")}đ</span>
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
