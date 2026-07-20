import { useState } from "react";
import VehicleGallery from "@/features/vehicle/VehicleGallery";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  MapPin,
  Motorbike,
  Calendar,
  Fuel,
  Gauge,
  Palette,
  CarFront,
  Hash,
} from "lucide-react";
import { formatTime } from "@repo/utils";
import Map from "@/components/map/Map";
import ReviewSection from "@/features/reviews/components/ReviewSection";
import VehicleStatusBadge from "@/components/common/VehicleStatusBadge";
import type { Vehicle, Branch } from "@repo/types";

type Props = {
  vehicle: Vehicle;
  branches: Branch[];
};

export default function VehicleInfo({ vehicle, branches }: Props) {
  const [currentTab, setCurrentTab] = useState("overview");

  return (
    <div className="h-full space-y-6">
      <VehicleGallery images={vehicle.images || []} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between border-b pb-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              {vehicle.name}
            </h1>
            <p className="text-muted-foreground mt-2 text-base leading-relaxed">
              {vehicle.description ||
                "No description available for this vehicle."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="default"
              className="px-3 py-1 text-xs font-medium gap-1.5"
            >
              <Motorbike className="h-3.5 w-3.5" />
              {vehicle.brandName || "N/A"} • {vehicle.modelName || "N/A"}
            </Badge>

            <Badge
              variant="outline"
              className="px-3 py-1 text-xs font-medium gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5" />
              {vehicle.currentBranchName || "Unknown Location"}
            </Badge>

            <VehicleStatusBadge status={vehicle.status || "unavailable"} />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 min-w-[220px] shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Rental Rate
          </p>
          <p className="text-2xl font-bold text-primary">
            {vehicle.pricePerDay
              ? `${vehicle.pricePerDay.toLocaleString("en-US")} VND`
              : "N/A"}
          </p>
          <span className="text-muted-foreground text-xs font-medium">
            per day (24 hours)
          </span>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <CarFront className="h-3.5 w-3.5" /> Vehicle Model
              </div>
              <p className="font-semibold text-sm">
                {vehicle.brandName} {vehicle.modelName}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5" /> Year
              </div>
              <p className="font-semibold text-sm">{vehicle.year || "N/A"}</p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Fuel className="h-3.5 w-3.5" /> Fuel Type
              </div>
              <p className="font-semibold text-sm capitalize">
                {vehicle.vehicleType || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Gauge className="h-3.5 w-3.5" /> Mileage
              </div>
              <p className="font-semibold text-sm">
                {vehicle.mileage
                  ? `${vehicle.mileage.toLocaleString("en-US")} km`
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Palette className="h-3.5 w-3.5" /> Exterior Color
              </div>
              <p className="font-semibold text-sm capitalize">
                {vehicle.color || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Hash className="h-3.5 w-3.5" /> License Plate
              </div>
              <p className="font-semibold text-sm uppercase tracking-wider">
                {vehicle.licensePlate || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-6 pt-4 border-t text-xs text-muted-foreground">
            <p>
              <span className="font-medium mr-1">Listed on:</span>{" "}
              {vehicle.createdAt ? formatTime(vehicle.createdAt) : "N/A"}
            </p>
            <p>
              <span className="font-medium mr-1">Last updated:</span>{" "}
              {vehicle.updatedAt ? formatTime(vehicle.updatedAt) : "N/A"}
            </p>
          </div>

          <div className="pt-4 h-[400px] rounded-2xl overflow-hidden border relative bg-card data-[state=inactive]:absolute data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none">
            <Map
              locations={branches}
              selectedBranchId={vehicle.currentBranchId}
              currentTab={currentTab}
            />
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-4">
          <ReviewSection vehicleId={vehicle.id || "1"} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
