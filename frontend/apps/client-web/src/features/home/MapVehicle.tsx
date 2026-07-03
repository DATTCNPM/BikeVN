import { useState, useMemo } from "react";
import Map from "@/components/map/Map";
import type { VehicleCardData } from "@repo/types";
import BranchVehicleList from "@/features/home/BranchVehicleList";
import { useBranches, useVehicleFilters } from "@repo/hooks";

export default function MapVehicle() {
  const [selectedBranch, setSelectedBranch] = useState<string>();
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");

  const { data: branches = [] } = useBranches();

  const selectedBranchData = useMemo(
    () => branches.find((b) => b.id === selectedBranch),
    [branches, selectedBranch],
  );

  const { data: vehicles, isLoading } = useVehicleFilters(
    {
      currentBranchName: selectedBranchData?.name,
      page: 1,
      size: 100,
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
    setActiveTab("list");
  };

  return (
    // h-screen và overflow-hidden giúp khóa cứng toàn bộ trang, không cho scroll chung
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full h-screen overflow-hidden max-w-[1600px] mx-auto bg-background">
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
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side: Branch & Vehicles (Vùng duy nhất ĐƯỢC PHÉP SCROLL nội bộ) */}
        <div
          className={`col-span-12 md:col-span-4 h-full overflow-hidden ${
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
          />
        </div>

        {/* Right Side: Map (Cố định, vừa khít khung màn hình, không scroll) */}
        <div
          className={`col-span-12 md:col-span-8 rounded-xl overflow-hidden border border-border bg-card shadow-sm h-full ${
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
