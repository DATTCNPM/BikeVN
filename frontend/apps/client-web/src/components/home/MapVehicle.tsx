import { useState } from "react";
import CardProduct from "@/components/common/CardProduct";
import Map from "@/components/map/Map";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import { useVehicleStore } from "@/stores/useVehicleStore";
import { useBranchStore } from "@/stores/useBranchStore";

import { useEffect, useMemo } from "react";

export default function MapVehicle() {
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    undefined,
  );

  const { vehicles, fetchVehicles, loading, error } = useVehicleStore();
  const {
    branches,
    fetchBranches,
    loading: branchLoading,
    error: branchError,
  } = useBranchStore();

  useEffect(() => {
    fetchVehicles();
    fetchBranches();
  }, [fetchVehicles, fetchBranches]);

  const selectedBranchData = branches.find((b) => b.id === selectedBranch);

  const vehicleListData = useMemo(() => {
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      vehicle_type: vehicle.model, // Assuming model represents the type
      price: vehicle.price_per_day,
      image: vehicle.image_url[0], // Use the first image as thumbnail
      location:
        branches.find((b) => b.id === vehicle.current_branch_id)?.name ||
        "Unknown",
      status: vehicle.status,
    }));
  }, [vehicles, branches]);

  const filteredVehicles = selectedBranch
    ? vehicleListData.filter((v) => v.location === selectedBranchData?.name)
    : null;

  if (loading || branchLoading) {
    return (
      <div className="w-full flex items-center justify-center h-[300px]">
        <Spinner />
      </div>
    );
  }
  if (error || branchError) {
    toast.error(error || branchError);
  }
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
          onSelectBranch={(branch) => setSelectedBranch(branch.id)}
        />
      </div>
    </div>
  );
}
