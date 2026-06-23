import { useParams } from "react-router-dom";

import VehicleInfo from "@/features/vehicle/VehicleInfo";
import BookingCard from "@/features/bookings/components/BookingCard";

import {
  useBranches,
  useVehicle,
  useVehicleBrands,
  useVehicleModels,
} from "@repo/hooks";

import { Spinner } from "@repo/ui/components/ui/spinner";

export default function VehicleDetail() {
  const { id } = useParams();

  const vehicleId = id || "";

  const { data: vehicle = null, isLoading: vehicleLoading } =
    useVehicle(vehicleId);

  const { data: branches = [], isLoading: branchLoading } = useBranches();

  const { data: brands, isLoading: brandsLoading } = useVehicleBrands();

  const { data: models, isLoading: modelsLoading } = useVehicleModels();

  const isPageLoading = vehicleLoading || branchLoading;

  if (isPageLoading || brandsLoading || modelsLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        Vehicle not found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-8 min-h-[calc(100vh-120px)] ">
      <div className="col-span-8 pr-2">
        <VehicleInfo
          vehicle={vehicle}
          branches={branches}
          brands={brands?.data ?? []}
          models={models?.data ?? []}
        />
      </div>

      <div className="col-span-4">
        <BookingCard vehicle={vehicle} branches={branches} />
      </div>
    </div>
  );
}
