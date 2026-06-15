import { useEffect, useState } from "react";

import CardProduct from "@/components/common/CardProduct";
import Map from "@/components/map/Map";

import type { Branch } from "@repo/types";
import { useGeolocation } from "@repo/hooks";
import { findNearestBranch } from "@repo/utils";

interface VehicleCardData {
  id: string;
  name: string;
  vehicle_type: string;
  price: number;
  image: string | null;
  location: string;
  status: string;
}

interface MapVehicleProps {
  vehicles: VehicleCardData[];
  branches: Branch[];
}

export default function MapVehicle({ vehicles, branches }: MapVehicleProps) {
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    undefined,
  );

  const { getCurrentLocation } = useGeolocation();

  const selectedBranchData = branches.find((b) => b.id === selectedBranch);

  const filteredVehicles = selectedBranch
    ? vehicles.filter((v) => v.location === selectedBranchData?.name)
    : vehicles;

  useEffect(() => {
    console.log("branches", branches);

    getCurrentLocation()
      .then((position) => {
        console.log("position", position);

        const nearest = findNearestBranch(
          position.coords.latitude,
          position.coords.longitude,
          branches,
        );

        console.log("nearest", nearest);

        if (nearest) {
          setSelectedBranch(nearest.branch.id);
        }
      })
      .catch((error) => {
        console.error("location error", error);
      });
  }, [branches, getCurrentLocation]);

  console.log(branches);

  return (
    <div className="w-full grid grid-cols-12 h-[500px]">
      <div className="col-span-4 bg-muted p-6 overflow-y-auto">
        {selectedBranchData ? (
          <div className="space-y-2 mb-6">
            <p className="text-muted-foreground">
              Xe hiện đang có của chi nhánh tại
            </p>

            <h2 className="text-2xl text-primary font-bold">
              {selectedBranchData.name}
            </h2>
          </div>
        ) : (
          <div className="space-y-2 mb-6">
            <p className="text-muted-foreground">
              Bạn hãy chọn một chi nhánh từ bản đồ bên cạnh
            </p>

            <h2 className="text-2xl text-primary font-bold">
              Tất cả chi nhánh
            </h2>

            {branches.map((b) => (
              <p key={b.id} className="text-sm text-muted-foreground">
                - {b.name}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-4 flex flex-col">
          {filteredVehicles.map((vehicle) => (
            <CardProduct
              key={vehicle.id}
              id={vehicle.id}
              title={vehicle.name}
              type={vehicle.vehicle_type}
              price={vehicle.price}
              image={vehicle.image}
              location={vehicle.location}
              status={vehicle.status}
            />
          ))}
        </div>
      </div>

      <div className="col-span-8 bg-muted">
        <Map
          locations={branches}
          selectedBranchId={selectedBranch}
          onSelectBranch={(branch) => {
            setSelectedBranch(branch.id);
          }}
        />
      </div>
    </div>
  );
}
