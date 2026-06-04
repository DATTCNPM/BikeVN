import { useParams } from "react-router-dom";

import VehicleInfo from "@/components/vehicle/VehicleInfo";
import CardBooking from "@/components/booking/BookingCard";

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

  const { data: brands = [], isLoading: brandsLoading } = useVehicleBrands();

  const { data: models = [], isLoading: modelsLoading } = useVehicleModels();

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
    <div className="grid w-full grid-cols-12 gap-8 py-8">
      <div className="col-span-8 flex flex-col gap-8">
        <VehicleInfo
          vehicle={vehicle}
          branches={branches}
          brands={brands}
          models={models}
        />
      </div>

      <div className="col-span-4">
        <CardBooking vehicle={vehicle} branches={branches} />
      </div>
    </div>
  );
}
