import { useParams } from "react-router-dom";
import { useState } from "react";

import { Spinner } from "@repo/ui/components/ui/spinner";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";

import { useVehicleReturnByBookingId } from "@/features/vehicleReturns/vehicleReturnQueries";
import VehicleReturnCreate from "@/features/vehicleReturns/components/VehicleReturnCreate";

export default function BookingReturnPage() {
  const { bookingId = "" } = useParams();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const { data: vehicleReturn, isLoading } =
    useVehicleReturnByBookingId(bookingId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!vehicleReturn) {
    return (
      <>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Thông tin trả xe</h2>

          <p className="text-muted-foreground">
            Booking này chưa có phiếu trả xe.
          </p>

          <Button onClick={() => setOpenCreateDialog(true)}>
            Tạo phiếu trả xe
          </Button>
        </div>

        <VehicleReturnCreate
          bookingId={bookingId}
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Thông tin trả xe</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-sm">Booking</p>

          <p>{vehicleReturn.bookingId}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Chi nhánh trả</p>

          <p>{vehicleReturn.returnBranchId}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Tình trạng</p>

          <Badge>{vehicleReturn.conditionStatus}</Badge>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Phí phát sinh</p>

          <p>{(vehicleReturn.extraFee ?? 0).toLocaleString()}đ</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-muted-foreground text-sm">Mô tả hư hỏng</p>

          <p>{vehicleReturn.damageDescription || "--"}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Công tơ mét</p>

          <p>{vehicleReturn.returnOdometerReading}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Nhân viên</p>

          <p>{vehicleReturn.employeeId}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Ngày tạo</p>

          <p>{new Date(vehicleReturn.createdAt).toLocaleString("vi-VN")}</p>
        </div>
      </div>

      {vehicleReturn.images?.length > 0 && (
        <div>
          <h3 className="mb-3 font-medium">Hình ảnh</h3>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {vehicleReturn.images.map((image) => (
              <img
                key={image}
                src={`http://localhost:8080${image}`}
                alt="Vehicle return"
                className="rounded-lg border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
