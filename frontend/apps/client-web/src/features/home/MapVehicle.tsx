import { useState, useMemo } from "react";
import Map from "@/components/map/Map";
import type { VehicleCardData } from "@repo/types";
import BranchVehicleList from "@/features/home/BranchVehicleList";
import { useBranches, useVehicleFilters } from "@repo/hooks";

export default function MapVehicle() {
  const [selectedBranch, setSelectedBranch] = useState<string>();
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");

  const [page, setPage] = useState(1);
  const size = 6;

  const { data: branches = [] } = useBranches();

  const selectedBranchData = useMemo(
    () => branches.find((b) => b.id === selectedBranch),
    [branches, selectedBranch],
  );

  const { data: vehicles, isLoading } = useVehicleFilters(
    {
      currentBranchName: selectedBranchData?.name,
      page,
      size,
    },
    !!selectedBranchData,
  );

  const vehicleCardData = useMemo<VehicleCardData[]>(() => {
    const vehicleData = vehicles?.data ?? [];
    return vehicleData.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      pricePerDay: vehicle.pricePerDay,
      image: vehicle.images?.[0]?.imageUrl ?? null,
      currentBranchName: vehicle.currentBranchName,
      vehicleType: vehicle.vehicleType,
      brandName: vehicle.brandName,
      modelName: vehicle.modelName,
      country: vehicle.country,
      status: vehicle.status,
    }));
  }, [vehicles]);

  const handleSelectBranch = (branchId: string) => {
    setSelectedBranch(branchId);
    setPage(1); // 🌟 Reset về page 1 khi đổi chi nhánh khác
    setActiveTab("list");
  };

  return (
    // h-screen và overflow-hidden giúp khóa cứng toàn bộ trang, không cho scroll chung
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full h-[calc(100vh-17rem)] overflow-hidden max-w-[1600px] mx-auto bg-background">
      {/* Mobile Tabs Switcher */}
      <div className="flex md:hidden bg-muted p-1 rounded-lg w-full shrink-0">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "list"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("list")}
        >
          List ({selectedBranchData ? vehicleCardData.length : "Chưa chọn"})
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "map"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("map")}
        >
          Map ({branches.length})
        </button>
      </div>

      {/* Main Layout Container */}
      <div className="grid grid-cols-12 gap-4 md:gap-5 flex-1 min-h-0">
        {/* Left Side: Branch & Vehicles (Rộng hơn để xe hiển thị trọn vẹn) */}
        <div
          className={`col-span-12 md:col-span-5 lg:col-span-5 h-full overflow-hidden ${
            activeTab === "list" ? "block" : "hidden md:block"
          }`}
        >
          <BranchVehicleList
            branches={branches}
            branch={selectedBranchData}
            vehicles={vehicleCardData}
            isLoading={isLoading}
            onSelectBranch={(branch) => handleSelectBranch(branch.id)}
            onBackToBranches={() => setSelectedBranch(undefined)}
            currentPage={vehicles?.currentPage}
            totalPages={vehicles?.totalPages}
            totalElements={vehicles?.totalElements}
            onPageChange={setPage}
          />
        </div>

        {/* Right Side: Map (Nhỏ gọn lại, nhường chỗ cho danh sách) */}
        <div
          className={`col-span-12 md:col-span-7 lg:col-span-7 rounded-xl overflow-hidden border border-border bg-card shadow-sm h-full ${
            activeTab === "map" ? "block" : "hidden md:block"
          }`}
        >
          <Map
            locations={branches}
            selectedBranchId={selectedBranch}
            onSelectBranch={(branch) => handleSelectBranch(branch.id)}
          />
        </div>
      </div>
    </div>
  );
}
