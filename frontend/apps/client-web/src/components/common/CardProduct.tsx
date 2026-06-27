import { useNavigate } from "react-router-dom";
import { ArrowRight, Fuel, Globe, MapPin, Zap } from "lucide-react";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { getImageUrl } from "@repo/utils";
import motorPlaceholder from "@/assets/images/motorbike1.png";
import type { VehicleCardData } from "@repo/types";
import VehicleStatusBadge from "./VehicleStatusBadge";

// 1. Tách cấu hình loại xe ra ngoài để JSX sạch hơn
const VEHICLE_TYPE_CONFIG = {
  electric: { label: "Electric", icon: Zap },
  fuel: { label: "Fuel", icon: Fuel },
} as const;

export default function CardProduct({ vehicle }: { vehicle: VehicleCardData }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  // Rút trích thông tin nhanh
  const brandAndModel = [vehicle.brandName, vehicle.modelName]
    .filter(Boolean)
    .join(" • ");

  // Lấy đúng cấu hình Type (Mặc định là fuel nếu lỗi data)
  const typeConfig =
    VEHICLE_TYPE_CONFIG[
      vehicle.vehicleType as keyof typeof VEHICLE_TYPE_CONFIG
    ] ?? VEHICLE_TYPE_CONFIG.fuel;
  const TypeIcon = typeConfig.icon;

  return (
    <Card className="group overflow-hidden pt-0 transition-all duration-300 hover:shadow-xl">
      {/* Media Section */}
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

      {/* Content Section */}
      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-1 text-xl font-semibold">{vehicle.name}</h3>
          {brandAndModel && (
            <p className="text-sm text-muted-foreground">{brandAndModel}</p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <TypeIcon className="mr-1 size-3" />
            {typeConfig.label}
          </Badge>

          {vehicle.country && (
            <Badge variant="outline">
              <Globe className="mr-1 size-3" />
              {vehicle.country}
            </Badge>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          {vehicle.currentBranchName || "Unknown Location"}
        </div>

        {/* Price */}
        <div>
          <div className="text-2xl font-bold text-primary">
            {(vehicle.pricePerDay ?? 0).toLocaleString("vi-VN")}đ{" "}
            <span className="text-sm font-normal text-muted-foreground">
              / day
            </span>
          </div>
        </div>

        {/* Actions */}
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
