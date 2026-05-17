import { Card } from "@repo/ui/components/ui/card";
import { Fuel, MapPin, Settings2 } from "lucide-react";
import type { Vehicle } from "@repo/types";
import { useBranches } from "@/hooks/useBranch";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "sonner";

import { useEffect } from "react";
export default function PaymentVehicleCard({
  vehicle,
}: {
  vehicle: Vehicle | null;
}) {
  const { data: branches = [], isLoading, error } = useBranches();
  useEffect(() => {
    if (error) {
      toast.error("Failed to load branches. Please try again.");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const nameBranches =
    branches.find((branch) => branch.id === vehicle?.current_branch_id)?.name ||
    "Unknown Branch";
  return (
    <Card className="overflow-hidden rounded-[2rem] border-border shadow-sm">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <img
          src={vehicle?.image_url?.[0] || "/placeholder-vehicle.png"}
          alt={vehicle?.name}
          className="h-full min-h-[240px] w-full object-cover"
        />

        <div className="p-6">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Vehicle
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight">
            {vehicle?.name}
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {/* <VehicleInfo
              icon={<Settings2 className="size-5" />}
              label="Transmission"
              value={vehicle.transmission}
            />

            <VehicleInfo
              icon={<Fuel className="size-5" />}
              label="Fuel"
              value={vehicle.fuel}
            /> */}

            <VehicleInfo
              icon={<MapPin className="size-5" />}
              label="Branch"
              value={nameBranches}
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
