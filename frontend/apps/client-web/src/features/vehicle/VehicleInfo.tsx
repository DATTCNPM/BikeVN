import { useMemo, useState } from "react";
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
import { formatDateTime } from "@repo/utils";
import Map from "@/components/map/Map";
import ReviewSection from "@/features/reviews/components/ReviewSection";
import VehicleStatusBadge from "@/components/common/VehicleStatusBadge";
import type { Vehicle, Branch, VehicleBrand, VehicleModel } from "@repo/types";

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
  const [currentTab, setCurrentTab] = useState("overview");

  const vehicleData = useMemo(() => {
    return {
      ...vehicle,
      locationName: branches?.find(
        (branch) => branch.id === vehicle?.currentBranchId,
      )?.name,
      brandName: brands.find((b) => b.id === vehicle.brandId)?.name || "N/A",
      modelName: models.find((m) => m.id === vehicle.modelId)?.name || "N/A",
    };
  }, [vehicle, branches, brands, models]);

  return (
    <div className="h-full space-y-6">
      <VehicleGallery images={vehicleData.images || []} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between border-b pb-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              {vehicleData.name}
            </h1>
            <p className="text-muted-foreground mt-2 text-base leading-relaxed">
              {vehicleData.description ||
                "No description available for this vehicle."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="default"
              className="px-3 py-1 text-xs font-medium gap-1.5"
            >
              <Motorbike className="h-3.5 w-3.5" />
              {vehicleData.brandName} • {vehicleData.modelName}
            </Badge>

            <Badge
              variant="outline"
              className="px-3 py-1 text-xs font-medium gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5" />
              {vehicleData.locationName || "Unknown Location"}
            </Badge>

            <VehicleStatusBadge status={vehicleData.status || "unavailable"} />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 min-w-[220px] shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Rental Rate
          </p>
          <p className="text-2xl font-bold text-primary">
            {vehicleData.pricePerDay
              ? `${vehicleData.pricePerDay.toLocaleString("en-US")} VND`
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
                {vehicleData.brandName} {vehicleData.modelName}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5" /> Year
              </div>
              <p className="font-semibold text-sm">
                {vehicleData.year || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Fuel className="h-3.5 w-3.5" /> Fuel Type
              </div>
              <p className="font-semibold text-sm capitalize">
                {vehicleData.vehicleType || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Gauge className="h-3.5 w-3.5" /> Mileage
              </div>
              <p className="font-semibold text-sm">
                {vehicleData.mileage
                  ? `${vehicleData.mileage.toLocaleString("en-US")} km`
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Palette className="h-3.5 w-3.5" /> Exterior Color
              </div>
              <p className="font-semibold text-sm capitalize">
                {vehicleData.color || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Hash className="h-3.5 w-3.5" /> License Plate
              </div>
              <p className="font-semibold text-sm uppercase tracking-wider">
                {vehicleData.licensePlate || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-6 pt-4 border-t text-xs text-muted-foreground">
            <p>
              <span className="font-medium mr-1">Listed on:</span>{" "}
              {vehicleData.createdAt
                ? formatDateTime(vehicleData.createdAt)
                : "N/A"}
            </p>
            <p>
              <span className="font-medium mr-1">Last updated:</span>{" "}
              {vehicleData.updatedAt
                ? formatDateTime(vehicleData.updatedAt)
                : "N/A"}
            </p>
          </div>

          <div className="pt-4 h-[400px] rounded-2xl overflow-hidden border relative bg-card data-[state=inactive]:absolute data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none">
            <Map
              locations={branches}
              selectedBranchId={vehicleData.currentBranchId}
              currentTab={currentTab}
            />
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-4">
          <ReviewSection vehicleId={vehicleData.id || "1"} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
