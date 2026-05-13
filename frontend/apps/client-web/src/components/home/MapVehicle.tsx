import { useState } from "react";
import CardProduct from "@/components/common/CardProduct";
import DataVehicleSample from "@/constants/VehicleDataSample";
import { branches } from "@/constants/BranchesDataSample";
import Map from "@/components/map/Map";

export default function MapVehicle() {
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    undefined,
  );
  const selectedBranchData = branches.find((b) => b.id === selectedBranch);
  const filteredVehicles = selectedBranch
    ? DataVehicleSample.filter((v) => v.current_branch_id === selectedBranch)
    : null;

  return (
    <div className="w-full grid grid-cols-12 h-[500px] ">
      <div className="col-span-4 bg-muted p-6 overflow-y-auto">
        {selectedBranchData ? (
          <div className="space-y-2 mb-6">
            <p className="text-muted-foreground ">
              Xe hiện đang có của chi nhánh tại
            </p>
            <h2 className="text-2xl text-primary font-bold ">
              {selectedBranchData?.name}
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
          {filteredVehicles?.map((vehicle) => (
            <CardProduct
              key={vehicle.id}
              id={vehicle.id}
              title={vehicle.name}
              type={vehicle.vehicle_type}
              price={vehicle.price}
              image={vehicle.image}
              location={
                branches.find((b) => b.id === vehicle.current_branch_id)
                  ?.name || "Unknown"
              }
              status={vehicle.status}
            />
          ))}
        </div>
      </div>
      <div className="col-span-8 bg-muted">
        <Map
          locations={branches}
          selectedBranchId={selectedBranch}
          onSelectBranch={(branch) => setSelectedBranch(branch.id)}
        />
      </div>
    </div>
  );
}
