import { useMemo, useState } from "react";
import CardProduct from "@/components/common/CardProduct";
import PaginationComponent from "@/components/common/PaginationComponent";
import SearchComponent from "@/components/common/Search";
import { Spinner } from "@repo/ui/components/ui/spinner";
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";

import {
  useBranches,
  useVehicleBrands,
  useVehicleModels,
  useVehicleFilters,
  useVehicles,
} from "@repo/hooks";
import { vehicleStatusSchema, vehicleTypeSchema } from "@repo/schemas";
import type { VehicleCardData, VehicleQueryParams } from "@repo/types";
import { PRICE_RANGES } from "@repo/constants";

export default function ListVehicle() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  const { data: branches = [], isLoading: branchLoading } = useBranches();
  const { data: brands } = useVehicleBrands();
  const { data: models } = useVehicleModels();
  const { data: vehicles, isLoading: vehicleLoading } = useVehicles(
    page,
    pageSize,
  );

  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "branch",
        title: "Branch",
        options: branches.map((b) => ({ label: b.name, value: b.name })),
      },
      {
        key: "brand",
        title: "Brand",
        options:
          brands?.data.map((b) => ({ label: b.name, value: b.name })) ?? [],
      },
      {
        key: "model",
        title: "Model",
        options:
          models?.data.map((m) => ({ label: m.name, value: m.name })) ?? [],
      },
      {
        key: "type",
        title: "Vehicle Type",
        options: [
          { label: "Electric", value: vehicleTypeSchema.enum.electric },
          { label: "Fuel", value: vehicleTypeSchema.enum.fuel },
        ],
      },
      {
        key: "status",
        title: "Status",
        options: [
          { label: "Available", value: vehicleStatusSchema.enum.available },
          { label: "Unavailable", value: vehicleStatusSchema.enum.unavailable },
          { label: "Maintenance", value: vehicleStatusSchema.enum.maintenance },
        ],
      },
      {
        key: "priceRange",
        title: "Price Range",
        options: PRICE_RANGES.map((p) => ({ label: p.label, value: p.value })),
      },
    ];
  }, [branches, brands, models]);

  const activePriceRange = PRICE_RANGES.find(
    (p) => p.value === selectedFilters["priceRange"]?.value,
  );

  const apiFilters = useMemo<VehicleQueryParams>(
    () => ({
      search: search.trim() || undefined,
      currentBranchName: selectedFilters["branch"]?.value,
      brandName: selectedFilters["brand"]?.value,
      modelName: selectedFilters["model"]?.value,
      vehicleType: selectedFilters["type"]?.value,
      status: selectedFilters["status"]?.value,
      minPrice: activePriceRange?.min,
      maxPrice: activePriceRange?.max,
      page,
      pageSize,
    }),
    [search, selectedFilters, activePriceRange, page],
  );

  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );
  const { data: filteredVehicles } = useVehicleFilters(apiFilters, hasFilter);
  const currentData = hasFilter ? filteredVehicles : vehicles;
  const vehicleData = currentData?.data ?? [];

  // 🛠️ Bọc và tối ưu hóa mảng dữ liệu hiển thị bằng useMemo
  const vehicleCardData = useMemo<VehicleCardData[]>(() => {
    if (!vehicleData) return [];

    // 1. Map dữ liệu thô sang cấu trúc VehicleCardData
    const mappedData: VehicleCardData[] = vehicleData.map((vehicle) => ({
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

    // 2. Sắp xếp: Đẩy "available" lên đầu, các trạng thái khác giữ nguyên vị trí tương đối
    return mappedData.sort((a, b) => {
      if (a.status === "available" && b.status !== "available") return -1;
      if (a.status !== "available" && b.status === "available") return 1;
      return 0;
    });
  }, [vehicleData]); // Chạy lại mỗi khi mảng dữ liệu gốc từ API thay đổi

  // Hàm xử lý nhanh khi click vào Quick Chips Hãng xe
  const handleQuickBrandSelect = (brandName: string) => {
    setSelectedFilters((prev) => {
      const isSelected = prev["brand"]?.value === brandName;
      return {
        ...prev,
        brand: isSelected ? undefined : { label: brandName, value: brandName },
      };
    });
    setPage(1);
  };

  if (vehicleLoading || branchLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🛠️ BAR TÌM KIẾM & LỌC CAO CẤP */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="w-full md:max-w-md">
          <SearchComponent
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            results={currentData?.totalElements ?? 0}
          />
        </div>

        <UniversalFilterSheet
          title="Advanced Filters"
          configs={filterConfigs}
          value={selectedFilters}
          onChange={(newFilters) => {
            setSelectedFilters(newFilters);
            setPage(1);
          }}
          onReset={() => {
            setSearch("");
            setSelectedFilters({});
            setPage(1);
          }}
        />
      </div>

      {/* 🏷️ QUICK BRAND CHIPS BAR (Chuẩn Airbnb phong cách tối giản) */}
      {brands?.data && brands.data.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mask-linear-r">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2 shrink-0">
            Quick Brands:
          </span>
          {brands.data.map((b) => {
            const isTarget = selectedFilters["brand"]?.value === b.name;
            return (
              <button
                key={b.id}
                onClick={() => handleQuickBrandSelect(b.name)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 shrink-0 ${
                  isTarget
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      )}

      {/* 🔲 LƯỚI CARD SẢN PHẨM 5 CỘT KHÔNG GIAN RỘNG */}
      {vehicleCardData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {vehicleCardData.map((vehicle) => (
            <CardProduct key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-3xl border-border/60">
          <p className="text-muted-foreground font-medium">
            No vehicles found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedFilters({});
            }}
            className="mt-3 text-xs text-primary font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* 📑 PHÂN TRANG */}
      {currentData && currentData.totalPages > 1 && (
        <PaginationComponent
          page={currentData.currentPage}
          totalPages={currentData.totalPages}
          totalElements={currentData.totalElements}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
