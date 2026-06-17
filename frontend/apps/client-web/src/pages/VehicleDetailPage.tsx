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

  const isLoading =
    vehicleLoading || branchLoading || brandsLoading || modelsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        Không tìm thấy xe
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-12 gap-8 p-8">
      <div className="col-span-8 flex flex-col gap-8 sticky top-24 h-[calc(100vh-6rem)]">
        <VehicleInfo
          vehicle={vehicle}
          branches={branches}
          brands={brands?.data || []}
          models={models?.data || []}
        />
      </div>

      <div className="col-span-4">
        <BookingCard vehicle={vehicle} branches={branches} />
      </div>
    </div>
  );
}
