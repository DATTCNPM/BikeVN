import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import { Button } from "@repo/ui/components/ui/button";

import { Info } from "lucide-react";

import type { Vehicle } from "@repo/types";

type Props = {
  vehicle: Vehicle;
};

export default function VehicleInfoDropdown({ vehicle }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Info className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Year: {vehicle.year}</DropdownMenuItem>

        <DropdownMenuItem>Color: {vehicle.color}</DropdownMenuItem>

        <DropdownMenuItem>Engine: {vehicle.licensePlate}cc</DropdownMenuItem>

        <DropdownMenuItem>Energy Type: {vehicle.vehicleType}</DropdownMenuItem>

        <DropdownMenuItem>
          Mileage: {vehicle.mileage.toLocaleString()}km
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
