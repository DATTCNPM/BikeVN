import CardProduct from "@/components/common/CardProduct";
import { useVehicles, useBranches } from "@repo/hooks";
import { filterImagePrimary } from "@repo/utils";
export default function Vehicle() {
  const { data: vehicles, isLoading } = useVehicles();
  const { data: branches } = useBranches();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="vehicles" className="space-y-16">
      <h2 className="text-3xl text-center font-bold text-primary mb-8">
        Dòng xe nổi bật
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles?.data?.map((vehicle) => (
          <CardProduct
            key={vehicle.id}
            id={vehicle.id}
            title={vehicle.name}
            type={vehicle.vehicleType}
            price={vehicle.pricePerDay}
            location={
              branches?.find((branch) => branch.id === vehicle.currentBranchId)
                ?.name || "Location not found"
            }
            status={vehicle.status}
            image={filterImagePrimary(vehicle.images || [])}
          />
        ))}
      </div>
    </section>
  );
}
