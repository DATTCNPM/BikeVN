import { Card } from "@repo/ui/components/ui/card";
import { MapPin, Motorbike } from "lucide-react";
import type { Vehicle } from "@repo/types";
import { filterImagePrimary } from "@repo/utils";
import imageMock from "@/assets/images/motorbike1.png";

export default function PaymentVehicleCard({
  vehicle,
}: {
  vehicle: Vehicle | null | undefined;
}) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-border shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-5 items-center">
        {/* Ảnh thu gọn lại */}
        <img
          src={filterImagePrimary(vehicle?.images || []) || imageMock}
          alt={vehicle?.name}
          className="h-32 w-full sm:w-44 rounded-2xl object-cover flex-shrink-0"
        />

        <div className="w-full">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            Vehicle Details
          </p>
          <h2 className="text-xl font-black tracking-tight mt-0.5">
            {vehicle?.name}
          </h2>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl">
              <MapPin className="size-3.5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Branch</p>
                <p className="font-semibold truncate max-w-[100px]">
                  {vehicle?.currentBranchName || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl">
              <Motorbike className="size-3.5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Type</p>
                <p className="font-semibold truncate max-w-[100px]">
                  {vehicle?.vehicleType || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl">
              <Motorbike className="size-3.5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Model</p>
                <p className="font-semibold truncate max-w-[100px]">
                  {vehicle?.modelName || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl">
              <Motorbike className="size-3.5 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Brand</p>
                <p className="font-semibold truncate max-w-[100px]">
                  {vehicle?.brandName || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
