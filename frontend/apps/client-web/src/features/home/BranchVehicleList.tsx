import type { Branch, VehicleCardData } from "@repo/types";
import CardProduct from "@/components/common/CardProduct";

type Props = {
  branches: Branch[];
  branch?: Branch;
  vehicles: VehicleCardData[];
  isLoading?: boolean;
  onSelectBranch?: (branch: Branch) => void;
  onBackToBranches?: () => void;
};

export default function BranchVehicleList({
  branches,
  branch,
  vehicles,
  isLoading,
  onSelectBranch,
  onBackToBranches,
}: Props) {
  // Trạng thái khi CHƯA CHỌN chi nhánh (Cho phép scroll chọn chi nhánh nếu danh sách dài)
  if (!branch) {
    return (
      <div className="flex flex-col h-full space-y-4">
        <div className="rounded-xl border border-dashed p-6 text-center bg-muted/30 shrink-0">
          <p className="text-sm text-muted-foreground font-medium">
            Please select a branch on the map or the list below.
          </p>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <h3 className="text-sm font-bold tracking-tight mb-2 text-foreground shrink-0">
            Branches ({branches.length})
          </h3>
          {/* Vùng scroll nội bộ của danh sách chi nhánh */}
          <div className="grid gap-2 overflow-y-auto pr-1 flex-1 pb-4">
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => onSelectBranch?.(b)}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 text-left transition-all group"
              >
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {b.name}
                </span>
                <span className="text-xs text-muted-foreground group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái khi ĐÃ CHỌN chi nhánh
  return (
    <div className="flex flex-col h-full">
      {/* Header Info - Đứng yên cố định */}
      <div className="mb-4 shrink-0">
        <button
          onClick={onBackToBranches}
          className="text-xs text-muted-foreground hover:text-primary mb-1 flex items-center gap-1 transition-colors"
        >
          ← Change Branch
        </button>
        <h2 className="text-xl font-bold tracking-tight text-foreground truncate">
          {branch.name}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {vehicles.length} vehicle{vehicles.length > 1 ? "s" : ""} available
        </p>
      </div>

      {/* Vehicles Container - Vùng duy nhất cuộn nội bộ nhận diện bằng `overflow-y-auto` */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1 pb-4 min-h-0 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 w-full animate-pulse bg-muted rounded-xl"
              />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Current branch has no available vehicles.
            </p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="transition-transform duration-200 hover:-translate-y-0.5"
            >
              <CardProduct vehicle={vehicle} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
