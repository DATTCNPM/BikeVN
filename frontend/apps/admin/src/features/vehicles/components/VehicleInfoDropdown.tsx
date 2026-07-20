import { Calendar, Fuel, Palette, Route } from "lucide-react";

import InfoPopover from "@/components/common/InfoPopover";

import type { Vehicle } from "@repo/schemas";

type Props = {
  vehicle: Vehicle;
};

export default function VehicleInfoPopover({ vehicle }: Props) {
  return (
    <InfoPopover
      title="Vehicle Information"
      description="Technical specifications"
      items={[
        {
          icon: Calendar,
          label: "Year",
          value: vehicle.year,
        },
        {
          icon: Palette,
          label: "Color",
          value: vehicle.color,
        },
        {
          icon: Fuel,
          label: "Type",
          value: vehicle.vehicleType,
        },
        {
          icon: Route,
          label: "Mileage",
          value: `${vehicle.mileage.toLocaleString()} km`,
        },
      ]}
    />
  );
}
