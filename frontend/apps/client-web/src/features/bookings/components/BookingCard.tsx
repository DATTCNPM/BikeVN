// components/booking/BookingCard.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDays,
  differenceInDays,
  format,
  startOfDay,
  endOfDay,
} from "date-fns";
import { vi } from "date-fns/locale";
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
import { useAuthStore } from "@/features/auth/authStore";
import { useProfile } from "@/features/profile/useProfile";
import { bookingFormSchema } from "@repo/schemas";
import type { Branch, Vehicle, BookingFormValues } from "@repo/types";

type Props = {
  vehicle: Vehicle;
  branches: Branch[];
};

const formatVND = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
const formatDate = (date: Date | undefined) =>
  date ? format(date, "dd/MM/yyyy", { locale: vi }) : "--";

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

  // Restore pending booking from localStorage
  useEffect(() => {
    const pendingBookingRaw = localStorage.getItem("pending-booking");
    if (!pendingBookingRaw) return;

    try {
      const booking = JSON.parse(pendingBookingRaw);
      if (booking.vehicleId === vehicle.id) {
        form.reset({
          returnBranchId: booking.formData.returnBranchId,
          dateRange: {
            from: new Date(booking.formData.dateRange.from),
            to: new Date(booking.formData.dateRange.to),
          },
        });
        localStorage.removeItem("pending-booking");
      }
    } catch (error) {
      console.error("Failed to parse pending booking data:", error);
    }
  }, [vehicle.id, form]);

  const onSubmit = (values: BookingFormValues) => {
    if (!isLogin) {
      localStorage.setItem(
        "pending-booking",
        JSON.stringify({ vehicleId: vehicle.id, formData: values }),
      );
      navigate("/login");
      return;
    }

    const payload = {
      userId: profile?.id || "",
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
    <Card className="w-full rounded-3xl">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <CardTitle className="text-3xl font-bold">
              {formatVND(vehicle.pricePerDay)}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                / day
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
                  <FieldLabel>Rental Period</FieldLabel>
                  <FieldContent>
                    <div className="overflow-hidden rounded-2xl border">
                      <Calendar
                        mode="range"
                        numberOfMonths={2}
                        selected={field.value as DateRange}
                        onSelect={(value) =>
                          value?.from && value?.to && field.onChange(value)
                        }
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
              <p className="text-sm text-muted-foreground">Pick-up Date</p>
              <p className="font-medium">{formatDate(startDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Return Date</p>
              <p className="font-medium">{formatDate(endDate)}</p>
            </div>
          </div>

          <Field className="pt-0">
            <FieldGroup>
              <FieldLabel>Pick-up Location</FieldLabel>
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
                  <FieldLabel>Return Location</FieldLabel>
                  <FieldContent>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 rounded-2xl">
                        <SelectValue placeholder="Select return location" />
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
              <span className="text-muted-foreground">Rental Days</span>
              <span>{totalDays} days</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Price per Day</span>
              <span>{formatVND(vehicle.pricePerDay)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total Price</span>
              <span className="text-2xl font-bold">
                {formatVND(totalPrice)}
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
            {isPending ? "Processing..." : "Book Now"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
