import VehicleGallery from "@/components/vehicle/VehicleGallery";
import DataVehicleSample from "@/constants/VehicleDataSample";
import { Badge } from "@/components/ui/badge";
import { MapPin, Smile, Motorbike } from "lucide-react";
import { branches } from "@/constants/BranchesDataSample";
import { formatDateTime } from "@/lib/format";

export default function VehicleInfo() {
  return (
    <>
      <VehicleGallery />

      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{DataVehicleSample[0].name}</h1>
          <div className="flex items-center space-x-4">
            <Badge variant="default">
              {" "}
              <Motorbike className="inline-block mr-2" />{" "}
              {DataVehicleSample[0].vehicle_type}
            </Badge>
            <Badge variant="outline">
              <MapPin className="inline-block mr-2" /> Location:{" "}
              {branches.find(
                (b) => b.id === DataVehicleSample[0].current_branch_id,
              )?.name || "Unknown"}
            </Badge>

            <Badge variant="secondary">
              <Smile className="inline-block mr-2" /> Status:{" "}
              {DataVehicleSample[0].status}
            </Badge>
          </div>
        </div>
        <p className="text-2xl font-semibold text-primary">
          {DataVehicleSample[0].price.toFixed(0)}đ
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
          {formatDateTime(DataVehicleSample[0].created_at)}
        </p>

        <p className="text-base text-muted-foreground">
          <span className="font-medium mr-2">Ngày cập nhật</span>
          {formatDateTime(DataVehicleSample[0].updated_at)}
        </p>
      </div>
    </>
  );
}
