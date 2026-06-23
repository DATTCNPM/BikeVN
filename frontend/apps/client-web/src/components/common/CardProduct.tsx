import { useNavigate } from "react-router-dom";

import { ArrowRight, Fuel, Globe, MapPin, Zap } from "lucide-react";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";

import { getImageUrl } from "@repo/utils";

import motorPlaceholder from "@/assets/images/motorbike1.png";

import type { VehicleCardData } from "@repo/types";
import VehicleStatusBadge from "./VehicleStatusBadge";

export default function CardProduct({ vehicle }: { vehicle: VehicleCardData }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  return (
    <Card className="group overflow-hidden pt-0 transition-all duration-300 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img
          src={vehicle.image ? getImageUrl(vehicle.image) : motorPlaceholder}
          alt={vehicle.name}
          className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute right-2 top-2">
          <VehicleStatusBadge status={vehicle.status || "unavailable"} />
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-1 text-xl font-semibold">{vehicle.name}</h3>

          {(vehicle.brandName || vehicle.modelName) && (
            <p className="text-sm text-muted-foreground">
              {[vehicle.brandName, vehicle.modelName]
                .filter(Boolean)
                .join(" • ")}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {vehicle.vehicleType === "electric" ? (
              <>
                <Zap className="mr-1 size-3" />
                Electric
              </>
            ) : (
              <>
                <Fuel className="mr-1 size-3" />
                Fuel
              </>
            )}
          </Badge>

          {vehicle.country && (
            <Badge variant="outline">
              <Globe className="mr-1 size-3" />
              {vehicle.country}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          {vehicle.currentBranchName || "Unknown Location"}
        </div>

        <div>
          <div className="text-2xl font-bold text-primary">
            {(vehicle.pricePerDay ? vehicle.pricePerDay : 0).toLocaleString(
              "vi-VN",
            )}
            đ{" "}
            <span className="text-sm font-normal text-muted-foreground">
              / day
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleViewDetails}>
            Book Now
            <ArrowRight className="ml-2 size-4" />
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={handleViewDetails}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
