import { useParams } from "react-router-dom";

import { Spinner } from "@repo/ui/components/ui/spinner";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

// Thêm một vài icon giúp giao diện trực quan, sinh động hơn
import {
  CalendarIcon,
  FileText,
  ImageIcon,
  MapPin,
  ShieldAlert,
  User,
  Gauge,
  DollarSign,
} from "lucide-react";

import { useVehicleReturnByBookingId } from "@/features/vehicleReturns/hooks/vehicleReturnQueries";

export default function BookingReturnPage() {
  const { bookingId = "" } = useParams();

  const { data: vehicleReturn, isLoading } =
    useVehicleReturnByBookingId(bookingId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  // Trạng thái tối ưu cho Empty State (Chưa có biên bản)
  if (!vehicleReturn) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-card/50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          No Vehicle Return Receipt Yet
        </h3>
        <p className="mt-2 mb-6 max-w-sm text-sm text-muted-foreground">
          This booking hasn't been processed for a return. Please inspect the
          vehicle condition and create a receipt.
        </p>
      </div>
    );
  }

  // Hàm trả về màu sắc badge tương ứng với trạng thái xe
  const getConditionColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "excellent":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10";
      case "good":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/10";
      case "fair":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/10";
      default:
        return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10";
    }
  };

  console.log("Vehicle Return Data:", vehicleReturn);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Vehicle Return Information
          </h2>
          <p className="text-sm text-muted-foreground">
            Details and condition logs recorded at checkout.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Cột trái & giữa: Thông tin chi tiết biên bản */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Receipt Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  Booking ID
                </span>
                <p className="font-mono text-sm bg-muted/50 p-1.5 rounded border">
                  {vehicleReturn.bookingId}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Return Branch
                </span>
                {/* MẸO: Nếu API có quan hệ populate, hãy thay thế bằng branch.name */}
                <p className="text-sm font-medium">
                  {vehicleReturn.returnBranchId}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  Vehicle Condition
                </span>
                <div>
                  <Badge
                    variant="outline"
                    className={`capitalize px-2.5 py-0.5 font-medium ${getConditionColor(vehicleReturn.conditionStatus)}`}
                  >
                    {vehicleReturn.conditionStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5" /> Return Odometer Reading
                </span>
                <p className="text-sm font-semibold">
                  {vehicleReturn.returnOdometerReading.toLocaleString()} km
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" /> Extra Fee
                </span>
                <p
                  className={`text-sm font-semibold ${vehicleReturn.extraFee > 0 ? "text-destructive" : "text-emerald-600"}`}
                >
                  {(vehicleReturn.extraFee ?? 0).toLocaleString()}đ
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Employee In Charge
                </span>
                {/* MẸO: Nên thay bằng employee.name nếu có dữ liệu liên kết */}
                <p className="text-sm font-medium">
                  {vehicleReturn.employeeId}
                </p>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" /> Damage Description
                </span>
                <div className="rounded-lg bg-muted/40 p-3 text-sm min-h-[50px] border border-stone-100">
                  {vehicleReturn.damageDescription || (
                    <span className="text-muted-foreground italic">
                      No damage reported.
                    </span>
                  )}
                </div>
              </div>

              {vehicleReturn.notes && (
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Notes
                  </span>
                  <p className="text-sm text-stone-600 bg-amber-50/30 border border-amber-100/60 rounded-lg p-3">
                    {vehicleReturn.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cột phải: Metadata hoặc dòng thời gian */}
        <Card className="h-fit shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" /> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Created Date</span>
              <span className="font-medium">
                {new Date(vehicleReturn.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Created Time</span>
              <span className="font-medium text-muted-foreground">
                {new Date(vehicleReturn.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Khu vực trưng bày hình ảnh biên bản bằng Grid Layout cao cấp */}
      {vehicleReturn.images?.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" /> Images
              Documentation ({vehicleReturn.images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {vehicleReturn.images.map((image, index) => (
                <div
                  key={image}
                  className="group relative aspect-video overflow-hidden rounded-xl border bg-muted shadow-sm transition-all duration-200 hover:ring-2 hover:ring-primary/50 cursor-pointer"
                >
                  <img
                    src={`${image}`}
                    alt={`Vehicle return inspection ${index + 1}`}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
                    <span className="text-xs text-white font-medium bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                      View Full
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
