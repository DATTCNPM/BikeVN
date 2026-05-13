import VehicleGallery from "@/components/vehicle/VehicleGallery";
import DataVehicleSample from "@/constants/VehicleDataSample";
import { Badge } from "@/components/ui/badge";
import { MapPin, Smile, Motorbike } from "lucide-react";
import { branches } from "@/constants/BranchesDataSample";
import { formatDateTime } from "@/lib/format";

import Map from "@/components/map/Map";
import ReviewSection from "@/components/vehicle/review/ReviewSection";

export default function VehicleInfo({ vehicleId }: { vehicleId: string }) {
  const locationVehicle = branches.find(
    (b) => b.id === DataVehicleSample[0].current_branch_id,
  );
  const vehicle = DataVehicleSample.find((v) => v.id === vehicleId);
  return (
    <>
      <VehicleGallery />

      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{vehicle?.name}</h1>
          <div className="flex items-center space-x-4">
            <Badge variant="default">
              {" "}
              <Motorbike className="inline-block mr-2" />{" "}
              {vehicle?.vehicle_type}
            </Badge>
            <Badge variant="outline">
              <MapPin className="inline-block mr-2" /> Location:{" "}
              {locationVehicle?.name || "Unknown"}
            </Badge>

            <Badge variant="secondary">
              <Smile className="inline-block mr-2" /> Status: {vehicle?.status}
            </Badge>
          </div>
        </div>
        <p className="text-2xl font-semibold text-primary">
          {vehicle?.price.toFixed(0)}đ
          <span className="text-lg text-muted-foreground"> / ngày</span>
        </p>
      </div>
      <p className="text-base text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>

      <div className="flex items-center space-x-4 ">
        <p className="text-base text-muted-foreground">
          <span className="font-medium mr-2">Ngày tạo</span>
          {vehicle ? formatDateTime(vehicle.created_at) : "Unknown"}
        </p>

        <p className="text-base text-muted-foreground">
          <span className="font-medium mr-2">Ngày cập nhật</span>
          {vehicle ? formatDateTime(vehicle.updated_at) : "Unknown"}
        </p>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Vị trí xe trên bản đồ</h2>
        <Map
          locations={locationVehicle ? [locationVehicle] : []}
          selectedBranchId={vehicle?.current_branch_id}
        />
      </div>
      <div className="mt-6">
        <ReviewSection />
      </div>
    </>
  );
}
