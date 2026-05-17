import { useEffect, useMemo } from "react";

import { toast } from "sonner";

import CardProduct from "@/components/common/CardProduct";
import PaginationComponent from "@/components/common/PaginationComponent";

import { Spinner } from "@repo/ui/components/ui/spinner";

import { useVehicles } from "@repo/hooks";
import { useBranches } from "@repo/hooks";

export default function ListVehicle() {
  const { data: vehicles = [], isLoading, error } = useVehicles();

  const {
    data: branches = [],
    isLoading: branchLoading,
    error: branchError,
  } = useBranches();

  useEffect(() => {
    if (error) {
      toast.error("Lấy danh sách xe thất bại");
    }
  }, [error]);

  useEffect(() => {
    if (branchError) {
      toast.error("Lấy danh sách chi nhánh thất bại");
    }
  }, [branchError]);

  const vehicleListData = useMemo(() => {
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      vehicle_type: vehicle.model,
      price: vehicle.price_per_day,
      image: vehicle.image_url[0],
      location:
        branches.find((branch) => branch.id === vehicle.current_branch_id)
          ?.name || "Unknown",
      status: vehicle.status,
    }));
  }, [vehicles, branches]);

  if (isLoading || branchLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
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
