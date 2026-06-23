import { useState } from "react";

import Map from "@/components/map/Map";

import type { Branch } from "@repo/types";
import type { VehicleCardData } from "@repo/types";
import BranchVehicleList from "@/features/home/BranchVehicleList";
import { useBranches, useVehicleFilters } from "@repo/hooks";

export default function MapVehicle() {
  const [selectedBranch, setSelectedBranch] = useState<string>();

  const { data: branches = [] } = useBranches();

  const selectedBranchData = branches.find((b) => b.id === selectedBranch);

  const { data: vehicles } = useVehicleFilters(
    {
      currentBranchName: selectedBranchData?.name,
      page: 1,
      pageSize: 100,
    },
    !!selectedBranchData,
  );

  const vehicleData = vehicles?.data ?? [];

  const vehicleCardData: VehicleCardData[] = vehicleData.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    pricePerDay: vehicle.pricePerDay,
    image: vehicle.images?.[0]?.imageUrl ?? null,
    currentBranchName: vehicle.currentBranchName,
    vehicleType: vehicle.vehicleType,
    brandName: vehicle.brandName,
    modelName: vehicle.modelName,
    country: vehicle.country,
    status: vehicle.status,
  }));

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-4">
        <BranchVehicleList
          branches={branches}
          branch={selectedBranchData}
          vehicles={vehicleCardData}
          onSelectBranch={(branch) => setSelectedBranch(branch.id)}
        />
      </div>

      <div className="col-span-8">
        <Map
          locations={branches}
          selectedBranchId={selectedBranch}
          onSelectBranch={(branch) => setSelectedBranch(branch.id)}
        />
      </div>
    </div>
  );
}
