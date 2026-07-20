import { Badge } from "@repo/ui/components/ui/badge";
import type { StatusVehicleEnum } from "@repo/schemas";

interface VehicleStatusBadgeProps {
  status: StatusVehicleEnum;
}

const statusConfig: Record<
  StatusVehicleEnum,
  {
    color: string;
    label: string;
  }
> = {
  available: {
    color: "bg-green-500",
    label: "Available",
  },
  unavailable: {
    color: "bg-red-500",
    label: "Unavailable",
  },
  maintenance: {
    color: "bg-yellow-500",
    label: "Maintenance",
  },
  rented: {
    color: "bg-blue-500",
    label: "Rented",
  },
};

// Define a default fallback for unknown statuses
const fallbackConfig = {
  color: "bg-gray-500",
  label: "Unknown",
};

export default function VehicleStatusBadge({
  status,
}: VehicleStatusBadgeProps) {
  // Use the fallback if the status isn't found in your config map
  const config = statusConfig[status] || fallbackConfig;

  return (
    <Badge variant="secondary">
      <span className={`inline-block h-3 w-3 rounded-full ${config.color}`} />
      <span className="ml-2">{config.label}</span>
    </Badge>
  );
}
