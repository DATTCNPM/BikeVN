import CardProduct from "@/components/common/CardProduct";
import PaginationComponent from "@/components/common/PaginationComponent";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import { useVehicleStore } from "@/stores/useVehicleStore";
import { useBranchStore } from "@/stores/useBranchStore";

import { useEffect, useMemo } from "react";

export default function ListVehicle() {
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
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {vehicleListData.map((vehicle) => (
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
      <PaginationComponent />
    </>
  );
}
