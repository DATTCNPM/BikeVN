import { Card } from "@repo/ui/components/ui/card";
import { MapPin, Motorbike } from "lucide-react";
import type { Vehicle } from "@repo/types";
import { filterImagePrimary } from "@repo/utils";
import imageMock from "@/assets/images/motorbike1.png";

export default function PaymentVehicleCard({
  vehicle,
}: {
  vehicle: Vehicle | null;
}) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-border shadow-sm">
      <div className="grid lg:grid-cols-2">
        <img
          src={filterImagePrimary(vehicle?.images || []) || imageMock}
          alt={vehicle?.name}
          className="h-full min-h-[240px] w-full object-fit"
        />

        <div className="p-6">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Vehicle
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight">
            {vehicle?.name}
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <VehicleInfo
              icon={<MapPin className="size-5" />}
              label="Branch"
              value={vehicle?.currentBranchName || "Unknown Branch"}
            />
            <VehicleInfo
              icon={<Motorbike className="size-5" />}
              label="Vehicle Type"
              value={vehicle?.vehicleType || "Unknown Type"}
            />

            <VehicleInfo
              icon={<Motorbike className="size-5" />}
              label="Vehicle Model"
              value={vehicle?.modelName || "Unknown Model"}
            />
            <VehicleInfo
              icon={<Motorbike className="size-5" />}
              label="Vehicle Brand"
              value={vehicle?.brandName || "Unknown Brand"}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function VehicleInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-muted/50 p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <p className="text-sm font-medium">{label}</p>
      </div>

      <p className="mt-3 font-semibold">{value}</p>
    </div>
  );
}
