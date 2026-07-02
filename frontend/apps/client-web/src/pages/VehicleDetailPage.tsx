import { useParams } from "react-router-dom";
import VehicleInfo from "@/features/vehicle/VehicleInfo";
import BookingCard from "@/features/bookings/components/BookingCard";
import { useBranches, useVehicle } from "@repo/hooks";
import { Spinner } from "@repo/ui/components/ui/spinner";

export default function VehicleDetail() {
  const { id } = useParams();
  const vehicleId = id || "";

  const { data: vehicle = null, isLoading: vehicleLoading } =
    useVehicle(vehicleId);
  const { data: branches = [], isLoading: branchLoading } = useBranches();

  const isPageLoading = vehicleLoading || branchLoading;

  if (isPageLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex h-[500px] items-center justify-center text-lg font-medium text-muted-foreground">
        Vehicle not found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-8 min-h-[calc(100vh-120px)] items-start">
      {/* Left Column: Vehicle Details & Gallery */}
      <div className="col-span-12 lg:col-span-8 pr-0 lg:pr-2">
        <VehicleInfo vehicle={vehicle} branches={branches} />
      </div>

      {/* Right Column: Sticky Booking Card Widget */}
      <div className="col-span-12 lg:col-span-4 sticky top-24">
        <BookingCard vehicle={vehicle} branches={branches} />
      </div>
    </div>
  );
}
