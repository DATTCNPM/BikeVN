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
    return (
      <div className="flex justify-center items-center min-h-[200px] text-white/60">
        Loading vehicles...
      </div>
    );
  }

  return (
    <section id="vehicles" className="space-y-12 scroll-mt-24">
      <h2 className="text-3xl text-center font-bold text-primary tracking-tight">
        Available Vehicles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {vehicleCardData.map((vehicle) => (
          // Đã bổ sung thuộc tính key ở đây dựa trên vehicle.id ổn định
          <CardProduct key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
