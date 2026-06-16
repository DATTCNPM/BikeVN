import VehicleGallery from "@/features/vehicle/VehicleGallery";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  MapPin,
  Smile,
  Motorbike,
  Calendar,
  Fuel,
  Gauge,
  Palette,
  CarFront,
  Hash,
  Banknote,
} from "lucide-react";
import { formatDateTime } from "@repo/utils";

import Map from "@/components/map/Map";
import ReviewSection from "@/features/reviews/components/ReviewSection";

import type { Vehicle, Branch, VehicleBrand, VehicleModel } from "@repo/types";

import { useMemo } from "react";

type Props = {
  vehicle: Vehicle;
  branches: Branch[];
  brands: VehicleBrand[];
  models: VehicleModel[];
};
export default function VehicleInfo({
  vehicle,
  branches,
  brands,
  models,
}: Props) {
  const vehicleData = useMemo(() => {
    return {
      ...vehicle,
      locationName: branches?.find(
        (branch) => branch.id === vehicle?.currentBranchId,
      )?.name,
      brandName: brands.find((b) => b.id === vehicle.brandId)?.name || "N/A",
      modelName: models.find((m) => m.id === vehicle.modelId)?.name || "N/A",
    };
  }, [vehicle, branches]);

  const locationVehicle = useMemo(() => {
    return branches.find((b) => b.id === vehicle?.currentBranchId);
  }, [vehicle, branches]);

  const statusMap = {
    available: {
      label: "Available",
      variant: "default" as const,
    },
    unavailable: {
      label: "Unavailable",
      variant: "destructive" as const,
    },
    maintenance: {
      label: "Maintenance",
      variant: "secondary" as const,
    },
  };

  console.log("Vehicle Data:", vehicleData);

  return (
    <div className="h-full overflow-y-auto">
      <VehicleGallery images={vehicleData.images || []} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">{vehicleData.name}</h1>

            <p className="text-muted-foreground mt-2">
              {vehicleData.description || "No description available"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default">
              <Motorbike className="mr-2 h-4 w-4" />
              {vehicleData.brandName} - {vehicleData.modelName}
            </Badge>

            <Badge variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              {vehicleData.locationName || "Unknown"}
            </Badge>

            <Badge
              variant={statusMap[vehicleData.status || "available"].variant}
            >
              <Smile className="mr-2 h-4 w-4" />
              {statusMap[vehicleData.status || "available"].label}
            </Badge>
          </div>
        </div>

        <div className="rounded-xl border p-6 min-w-[250px]">
          <p className="text-sm text-muted-foreground mb-2">Rental price</p>

          <p className="text-3xl font-bold text-primary">
            {vehicleData.pricePerDay
              ? vehicleData.pricePerDay.toLocaleString("vi-VN")
              : "N/A"}
            đ
          </p>

          <span className="text-muted-foreground text-sm">/ day</span>
        </div>
      </div>

      <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CarFront className="h-4 w-4" />
            Vehicle
          </div>

          <p className="font-medium">
            {vehicleData.brandName} {vehicleData.modelName}
          </p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Year
          </div>

          <p className="font-medium">{vehicleData.year}</p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Fuel className="h-4 w-4" />
            Fuel type
          </div>

          <p className="font-medium">{vehicleData.vehicleType || "N/A"}</p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="h-4 w-4" />
            Mileage
          </div>

          <p className="font-medium">
            {vehicleData.mileage
              ? vehicleData.mileage.toLocaleString("vi-VN")
              : "N/A"}{" "}
            km
          </p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Palette className="h-4 w-4" />
            Color
          </div>

          <p className="font-medium">{vehicleData.color}</p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="h-4 w-4" />
            License plate
          </div>

          <p className="font-medium">{vehicleData.licensePlate}</p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Motorbike className="h-4 w-4" />
            Engine capacity
          </div>

          <p className="font-medium">{""} cc</p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Banknote className="h-4 w-4" />
            Price per day
          </div>

          <p className="font-medium">
            {vehicleData.pricePerDay
              ? vehicleData.pricePerDay.toLocaleString("vi-VN")
              : "N/A"}
            đ
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-8 text-sm text-muted-foreground">
        <p>
          <span className="font-medium mr-2">Created at:</span>

          {vehicleData.createdAt
            ? formatDateTime(vehicleData.createdAt)
            : "Undefined"}
        </p>

        <p>
          <span className="font-medium mr-2">Updated at:</span>

          {vehicleData.updatedAt
            ? formatDateTime(vehicleData.updatedAt)
            : "Undefined"}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Vehicle location</h2>

        <Map
          locations={locationVehicle ? [locationVehicle] : []}
          selectedBranchId={vehicleData.currentBranchId}
        />
      </div>

      <div className="mt-8">
        <ReviewSection vehicleId={vehicleData.id || "1"} />
      </div>
    </div>
  );
}
