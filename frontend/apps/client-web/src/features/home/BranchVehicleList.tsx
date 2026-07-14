import type { Branch, VehicleCardData } from "@repo/types";
import CardProduct from "@/components/common/CardProduct";
import { MapPin, ChevronRight, ArrowLeft, Car } from "lucide-react";
import PaginationComponent from "@/components/common/PaginationComponent";

type Props = {
  branches: Branch[];
  branch?: Branch;
  vehicles: VehicleCardData[];
  isLoading?: boolean;
  onSelectBranch?: (branch: Branch) => void;
  onBackToBranches?: () => void;
  currentPage?: number;
  totalPages?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
};

export default function BranchVehicleList({
  branches,
  branch,
  vehicles,
  isLoading,
  onSelectBranch,
  onBackToBranches,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: Props) {
  // --- TRẠNG THÁI: CHƯA CHỌN CHI NHÁNH ---
  if (!branch) {
    return (
      <div className="flex flex-col h-full space-y-4">
        <div className="rounded-2xl border border-dashed border-border/80 p-5 text-center bg-muted/30 shrink-0">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
            <MapPin className="size-4 text-primary animate-bounce" />
            Please select a branch on the map or the list below.
          </p>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground shrink-0">
            Available Branches ({branches.length})
          </h3>

          <div className="grid gap-2 overflow-y-auto pr-1 flex-1 pb-2 custom-scrollbar">
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => onSelectBranch?.(b)}
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-accent/40 text-left transition-all group hover:border-primary/20 shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                    <MapPin className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {b.name}
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- TRẠNG THÁI: ĐÃ CHỌN CHI NHÁNH ---
  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header Info */}
      <div className="shrink-0 bg-background/50 backdrop-blur-sm rounded-xl border border-border/60 p-3 shadow-sm">
        <button
          onClick={onBackToBranches}
          className="text-xs text-muted-foreground hover:text-primary mb-2 flex items-center gap-1.5 transition-colors font-medium group"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />{" "}
          Change Branch
        </button>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold tracking-tight text-foreground truncate flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="truncate">{branch.name}</span>
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 bg-muted/60 px-2 py-0.5 rounded-md">
            <Car className="size-3.5 text-primary" />
            <span>
              {totalElements ?? vehicles.length} vehicle
              {(totalElements ?? vehicles.length) > 1 ? "s" : ""}
            </span>
          </p>
        </div>
      </div>

      {/* Vùng cuộn danh sách xe độc lập */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
        {isLoading ? (
          /* Đồng bộ Skeleton dạng Grid 2 cột mượt mà */
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 4, 4].map((n) => (
              <div
                key={n}
                className="h-48 w-full animate-pulse bg-muted/60 rounded-xl border border-border/40"
              />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 text-center bg-muted/10">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Current branch has no available vehicles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-2">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="transition-all duration-300 hover:shadow-sm rounded-xl overflow-hidden"
              >
                <CardProduct vehicle={vehicle} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Phân trang được tách biệt cố định ở đáy */}
      {!isLoading && totalPages
        ? totalPages > 1 && (
            <div className="pt-2 border-t border-border/60 bg-background shrink-0">
              <PaginationComponent
                page={currentPage || 1}
                totalPages={totalPages || 1}
                totalElements={totalElements || 0}
                onPageChange={onPageChange || (() => {})}
              />
            </div>
          )
        : null}
    </div>
  );
}
