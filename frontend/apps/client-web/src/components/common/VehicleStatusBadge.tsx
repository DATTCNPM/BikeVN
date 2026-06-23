import { Badge } from "@repo/ui/components/ui/badge";

import type { StatusVehicleEnum } from "@repo/types";

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
};

export default function VehicleStatusBadge({
  status,
}: VehicleStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary">
      <span className={`inline-block h-3 w-3 rounded-full ${config.color}`} />
      <span className="ml-2">{config.label}</span>
    </Badge>
  );
}
