import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { addDays, format, startOfDay, endOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import VehicleStatusBadge from "@/components/common/VehicleStatusBadge";

import { useCreateBooking } from "@/features/bookings/hooks/mutations";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { bookingFormSchema } from "@repo/schemas";
import type { Branch, Vehicle, BookingFormValues } from "@repo/types";
import { calculateTotalDays, calculateTotalPrice } from "@repo/utils";
import { toast } from "@repo/ui/components/ui/sonner";
import { isApiError } from "@repo/api";
import { ERROR_MESSAGES } from "@repo/providers"; // 🌟 Import file cấu hình lỗi nghiệp vụ
import VerificationModal from "./VerificationModal";

type Props = {
  vehicle: Vehicle;
  branches: Branch[];
};

const formatCurrency = (value: number) =>
  `${new Intl.NumberFormat("en-US").format(value)} VND`;

const formatDate = (date: Date | undefined) =>
  date ? format(date, "MMM dd, yyyy", { locale: enUS }) : "--";

export default function BookingCard({ vehicle, branches }: Props) {
  const navigate = useNavigate();
  const { isLogin } = useAuthStore();
  const { data: profile } = useProfile();
  const { mutate: createBooking, isPending } = useCreateBooking();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

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

  const totalDays = calculateTotalDays(startDate, endDate);
  const totalPriceBooking = calculateTotalPrice(totalDays, vehicle.pricePerDay);

  const branchOptions = useMemo(() => {
    return branches.map((branch) => ({
      label: branch.name,
      value: branch.id,
    }));
  }, [branches]);

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

    // 1. Kiểm tra thông tin cá nhân bắt buộc (Giữ nguyên)
    const missing: string[] = [];
    if (!profile?.phone) missing.push("Phone Number");
    if (!profile?.cccdNumber) missing.push("National ID (CCCD)");

    if (missing.length > 0) {
      setMissingFields(missing);
      setModalOpen(true);
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
      onError: (error: unknown) => {
        if (isApiError(error)) {
          // 1. Xử lý trường hợp phân quyền / trạng thái đặc biệt từ HTTP status
          if (error.status === 403) {
            toast.error(
              "You have an unpaid booking. Please complete it before making a new one.",
            );
            return;
          }

          // 2. Tự động lấy câu báo lỗi chuẩn từ file cấu hình ERROR_MESSAGES dựa trên code hệ thống
          const errorConfig = ERROR_MESSAGES[error.code];
          const finalMessage = errorConfig
            ? errorConfig.message
            : error.message;

          toast.error(finalMessage || "Failed to create booking.");
        } else {
          // Lỗi không xác định hoặc lỗi mạng
          const err = error as Error;
          toast.error(err.message || "An unexpected error occurred.");
        }
      },
    });
  };

  return (
    <Card className="w-full rounded-3xl shadow-sm border-muted/60">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {formatCurrency(vehicle.pricePerDay ?? 0)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / day
              </span>
            </CardTitle>
          </div>
          <VehicleStatusBadge status={vehicle.status || "unavailable"} />
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
                  <FieldLabel className="font-semibold text-foreground">
                    Rental Period
                  </FieldLabel>
                  <FieldContent>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="grid grid-cols-2 gap-4 w-full text-left rounded-2xl border bg-muted/30 p-4 hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        >
                          <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                              <CalendarIcon className="size-3 text-primary" />{" "}
                              Pick-up
                            </p>
                            <p className="text-sm font-semibold">
                              {formatDate(startDate)}
                            </p>
                          </div>
                          <div className="space-y-1 border-l pl-4 border-border/60">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                              Return
                            </p>
                            <p className="text-sm font-semibold">
                              {formatDate(endDate)}
                            </p>
                          </div>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 rounded-2xl shadow-xl border border-border/80"
                        align="start"
                      >
                        <Calendar
                          mode="range"
                          numberOfMonths={1}
                          selected={field.value as DateRange}
                          onSelect={(value) => {
                            if (value?.from) {
                              field.onChange(value);
                              if (value.to) {
                                setIsCalendarOpen(false);
                              }
                            }
                          }}
                          defaultMonth={field.value?.from}
                          disabled={(date) => date < startOfDay(new Date())}
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </FieldGroup>
              </Field>
            )}
          />

          <Field className="pt-0">
            <FieldGroup>
              <FieldLabel className="font-semibold text-foreground">
                Pick-up Location
              </FieldLabel>
              <FieldContent>
                <p className="text-sm font-medium text-muted-foreground">
                  {vehicle.currentBranchName || "Not Specified"}
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
                  <FieldLabel className="font-semibold text-foreground">
                    Return Location
                  </FieldLabel>
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
              <span className="text-muted-foreground">Rental Duration</span>
              <span className="font-medium">
                {totalDays} {totalDays === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Base Rate</span>
              <span className="font-medium">
                {formatCurrency(vehicle.pricePerDay ?? 0)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-foreground">
                Total Price
              </span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(totalPriceBooking)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-2xl text-base font-semibold shadow-sm transition-all"
          >
            {isPending ? "Processing Request..." : "Book Now"}
          </Button>
        </CardFooter>
      </form>
      <VerificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        missingFields={missingFields}
      />
    </Card>
  );
}
