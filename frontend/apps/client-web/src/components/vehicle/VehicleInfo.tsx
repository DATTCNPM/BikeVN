import VehicleGallery from "@/components/vehicle/VehicleGallery";
import { Badge } from "@repo/ui/components/badge";
import { Spinner } from "@repo/ui/components/spinner";
import { toast } from "sonner";
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
import ReviewSection from "@/components/vehicle/review/ReviewSection";

import { useEffect, useMemo } from "react";
import { useBranches } from "@/hooks/useBranch";
import { useVehicle } from "@/hooks/useVehicle";

export default function VehicleInfo({ vehicleId }: { vehicleId: string }) {
  const {
    data: branches,
    isLoading: branchLoading,
    error: branchError,
  } = useBranches();

  const {
    data: selectedVehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useVehicle(vehicleId);

  const vehicleData = useMemo(() => {
    return {
      ...selectedVehicle,
      locationName: branches.find(
        (branch) => branch.id === selectedVehicle?.current_branch_id,
      )?.name,
    };
  }, [selectedVehicle, branches]);

  const locationVehicle = useMemo(() => {
    return branches.find((b) => b.id === selectedVehicle?.current_branch_id);
  }, [selectedVehicle, branches]);

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

  const fuelTypeMap = {
    gasoline: "Gasoline",
    diesel: "Diesel",
    electric: "Electric",
    hybrid: "Hybrid",
  };

  useEffect(() => {
    if (branchError) {
      toast.error("Branch not found");
    }
    if (vehicleError) {
      toast.error("Vehicle not found");
    }
  }, [branchError, vehicleError]);

  if (branchLoading || vehicleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <VehicleGallery images={vehicleData.image_url || []} />

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
              {vehicleData.brand} - {vehicleData.model}
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
            {vehicleData.price_per_day
              ? vehicleData.price_per_day.toLocaleString("vi-VN")
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
            {vehicleData.brand} {vehicleData.model}
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

          <p className="font-medium">
            {fuelTypeMap[vehicleData.fuel_type || "gasoline"]}
          </p>
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

          <p className="font-medium">{vehicleData.license_plate}</p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Motorbike className="h-4 w-4" />
            Engine capacity
          </div>

          <p className="font-medium">{vehicleData.engine_capacity} cc</p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Banknote className="h-4 w-4" />
            Price per day
          </div>

          <p className="font-medium">
            {vehicleData.price_per_day
              ? vehicleData.price_per_day.toLocaleString("vi-VN")
              : "N/A"}
            đ
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-8 text-sm text-muted-foreground">
        <p>
          <span className="font-medium mr-2">Created at:</span>

          {vehicleData.created_at
            ? formatDateTime(vehicleData.created_at)
            : "Undefined"}
        </p>

        <p>
          <span className="font-medium mr-2">Updated at:</span>

          {vehicleData.updated_at
            ? formatDateTime(vehicleData.updated_at)
            : "Undefined"}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Vehicle location</h2>

        <Map
          locations={locationVehicle ? [locationVehicle] : []}
          selectedBranchId={vehicleData.current_branch_id}
        />
      </div>

      <div className="mt-8">
        <ReviewSection />
      </div>
    </>
  );
}
