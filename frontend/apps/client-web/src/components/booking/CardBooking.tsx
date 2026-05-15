"use client";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { addDays, differenceInDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { type DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import Filter from "@/components/common/Filter";

import { useBookingStore } from "@/stores/useBookingStore";

const branchOptions = ["Chi nhánh TP.HCM", "Chi nhánh Cần Thơ"];

const PRICE_PER_DAY = 150000;

export default function BookingCard() {
  const { bookings } = useBookingStore();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });

  const startDate = dateRange?.from;
  const endDate = dateRange?.to;

  const totalDays =
    startDate && endDate ? differenceInDays(endDate, startDate) || 1 : 0;

  const totalPrice = totalDays * PRICE_PER_DAY;

  const navigate = useNavigate();
  return (
    <Card className="sticky top-24 w-full">
      {/* Header */}
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Giá thuê</p>

            <CardTitle className="text-3xl font-bold">
              {PRICE_PER_DAY.toLocaleString("vi-VN")}đ
              <span className="ml-1 text-base font-normal text-muted-foreground">
                / ngày
              </span>
            </CardTitle>
          </div>

          <Badge className="rounded-full">Available</Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-6">
        {/* Calendar */}
        <div className="overflow-hidden rounded-2xl border">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="w-full"
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
          />
        </div>

        {/* Selected Dates */}
        <div className="grid grid-cols-2 gap-4 rounded-xl border p-4">
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

        {/* Pickup Branch */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Nơi nhận xe</p>

          <Filter title="Chọn nơi nhận xe" content={branchOptions} />
        </div>

        {/* Return Branch */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Nơi trả xe</p>

          <Filter title="Chọn nơi trả xe" content={branchOptions} />
        </div>

        <Separator />

        {/* Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Số ngày thuê</span>

            <span>{totalDays} ngày</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Giá mỗi ngày</span>

            <span>{PRICE_PER_DAY.toLocaleString("vi-VN")}đ</span>
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

      {/* Footer */}
      <CardFooter>
        <Button
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={() => navigate(`/payment/${bookings[0].id}`)}
        >
          Đặt xe ngay
        </Button>
      </CardFooter>
    </Card>
  );
}
