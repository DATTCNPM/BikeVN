import CardProduct from "@/components/common/CardProduct";
import { useVehicles } from "@repo/hooks";
import type { VehicleCardData } from "@repo/types";
export default function Vehicle() {
  const { data: vehicles, isLoading } = useVehicles(1, 10);

  const vehicleData = vehicles?.data || [];

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="vehicles" className="space-y-16">
      <h2 className="text-3xl text-center font-bold text-primary mb-8">
        Dòng xe nổi bật
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicleCardData.map((vehicle) => (
          <CardProduct vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
