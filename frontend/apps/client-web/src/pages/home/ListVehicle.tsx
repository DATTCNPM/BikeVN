import CardProduct from "@/components/common/CardProduct";
import PaginationComponent from "@/components/common/PaginationComponent";
import DataVehicleSample from "@/constants/VehicleDataSample";
import { branches } from "@/constants/BranchesDataSample";
export default function ListVehicle() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {DataVehicleSample.map((vehicle) => (
          <CardProduct
            key={vehicle.id}
            title={vehicle.name}
            type={vehicle.vehicle_type}
            price={vehicle.price}
            image={vehicle.image}
            location={
              branches.find((b) => b.id === vehicle.current_branch_id)?.name ||
              "Unknown"
            }
            status={vehicle.status}
          />
        ))}
      </div>
      <PaginationComponent />
    </>
  );
}
