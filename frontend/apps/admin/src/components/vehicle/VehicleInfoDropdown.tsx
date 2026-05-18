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
        <DropdownMenuItem>Năm SX: {vehicle.year}</DropdownMenuItem>

        <DropdownMenuItem>Màu: {vehicle.color}</DropdownMenuItem>

        <DropdownMenuItem>
          Động cơ: {vehicle.engine_capacity}cc
        </DropdownMenuItem>

        <DropdownMenuItem>Nhiên liệu: {vehicle.fuel_type}</DropdownMenuItem>

        <DropdownMenuItem>
          Số km: {vehicle.mileage.toLocaleString()}km
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
