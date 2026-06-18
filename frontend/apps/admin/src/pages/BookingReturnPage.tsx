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
          <h2 className="text-xl font-semibold">Vehicle Return Information</h2>

          <p className="text-muted-foreground">
            This booking does not have a return receipt yet.
          </p>

          <Button onClick={() => setOpenCreateDialog(true)}>
            Create Return Receipt
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
      <h2 className="text-xl font-semibold">Vehicle Return Information</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-sm">Booking</p>

          <p>{vehicleReturn.bookingId}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Return Branch</p>

          <p>{vehicleReturn.returnBranchId}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Condition Status</p>

          <Badge>{vehicleReturn.conditionStatus}</Badge>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Extra Fee</p>

          <p>{(vehicleReturn.extraFee ?? 0).toLocaleString()}đ</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-muted-foreground text-sm">Damage Description</p>

          <p>{vehicleReturn.damageDescription || "--"}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">
            Return Odometer Reading
          </p>

          <p>{vehicleReturn.returnOdometerReading}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Employee</p>

          <p>{vehicleReturn.employeeId}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Created Date</p>

          <p>{new Date(vehicleReturn.createdAt).toLocaleString("vi-VN")}</p>
        </div>
      </div>

      {vehicleReturn.images?.length > 0 && (
        <div>
          <h3 className="mb-3 font-medium">Images</h3>

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
