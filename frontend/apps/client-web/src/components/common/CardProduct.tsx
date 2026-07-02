import { useNavigate } from "react-router-dom";
import { Fuel, Globe, MapPin, Zap } from "lucide-react";
import { Badge } from "@repo/ui/components/ui/badge";
import motorPlaceholder from "@/assets/images/motorbike1.png";
import type { VehicleCardData } from "@repo/types";
import VehicleStatusBadge from "./VehicleStatusBadge";

const VEHICLE_TYPE_CONFIG = {
  electric: { label: "Electric", icon: Zap },
  fuel: { label: "Fuel", icon: Fuel },
} as const;

export default function CardProduct({ vehicle }: { vehicle: VehicleCardData }) {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  const brandAndModel = [vehicle.brandName, vehicle.modelName]
    .filter(Boolean)
    .join(" • ");

  const typeConfig =
    VEHICLE_TYPE_CONFIG[
      vehicle.vehicleType as keyof typeof VEHICLE_TYPE_CONFIG
    ] ?? VEHICLE_TYPE_CONFIG.fuel;
  const TypeIcon = typeConfig.icon;

  console.log(
    "🚀 ~ file: CardProduct.tsx:24 ~ CardProduct ~ vehicle:",
    vehicle,
  );
  return (
    <div
      onClick={handleViewDetails}
      className="group relative bg-card rounded-[22px] border border-border/40 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
    >
      {/* Media Spotlight Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/40">
        <img
          src={vehicle.image ?vehicle.image : motorPlaceholder}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Lớp gradient dịu mắt bảo vệ badge */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-60" />

        {/* Floating Glassmorphism Badge */}
        <div className="absolute top-3 right-3 z-10 backdrop-blur-md rounded-full overflow-hidden shadow-sm">
          <VehicleStatusBadge status={vehicle.status || "unavailable"} />
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {vehicle.name}
          </h3>
          {brandAndModel && (
            <p className="text-xs font-medium text-muted-foreground/80 mt-0.5">
              {brandAndModel}
            </p>
          )}
        </div>

        {/* Cụm Badges tính năng mini */}
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="px-2 py-0.5 text-[10px] font-medium bg-secondary/80 text-foreground rounded-md border-none"
          >
            <TypeIcon className="mr-1 size-2.5 text-muted-foreground" />
            {typeConfig.label}
          </Badge>

          {vehicle.country && (
            <Badge
              variant="outline"
              className="px-2 py-0.5 text-[10px] font-medium text-muted-foreground/90 rounded-md border-border/60"
            >
              <Globe className="mr-1 size-2.5" />
              {vehicle.country}
            </Badge>
          )}
        </div>

        {/* Địa điểm định vị */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
          <span className="truncate">
            {vehicle.currentBranchName || "Not specified"}
          </span>
        </div>

        {/* Khu vực Giá thành */}
        <div className="pt-2 border-t border-border/30 flex items-baseline justify-between">
          <div className="text-lg font-bold text-foreground tracking-tight">
            {(vehicle.pricePerDay ?? 0).toLocaleString("vi-VN")}đ
            <span className="text-xs font-normal text-muted-foreground ml-1">
              / day
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
