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

const PRICE_RANGES = [
  { label: "Below 100k", value: "under-100", min: 0, max: 100000 },
  { label: "100k - 200k", value: "100-200", min: 100000, max: 200000 },
  { label: "Above 200k", value: "over-200", min: 200000, max: undefined },
];

export default function ListVehicle() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Khởi tạo một object state duy nhất quản lý các mảng lọc
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // Fetching dữ liệu phục vụ các option filter
  const { data: branches = [], isLoading: branchLoading } = useBranches();
  const { data: brands } = useVehicleBrands();
  const { data: models } = useVehicleModels();
  const { data: vehicles, isLoading: vehicleLoading } = useVehicles(
    page,
    pageSize,
  );

  // 1. Khởi tạo cấu hình Metadata cho Filter Sheet (Rất trực quan và dễ quản lý)
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "branch",
        title: "Location",
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

  // Tìm min/max price dựa trên option đang select hiện tại
  const activePriceRange = PRICE_RANGES.find(
    (p) => p.value === selectedFilters["priceRange"]?.value,
  );

  // 2. Chuyển đổi dữ liệu từ object state sang Query Params gửi lên API
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

  // Map data hiển thị cho card sản phẩm
  const vehicleCardData: VehicleCardData[] = vehicleData.map((vehicle) => ({
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

  if (vehicleLoading || branchLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SearchComponent
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            results={currentData?.totalElements ?? 0}
          />
        </div>

        {/* Gọi Component Sheet đa năng đã tách biệt hoàn toàn */}
        <UniversalFilterSheet
          title="Vehicle Filters"
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

      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {vehicleCardData.map((vehicle) => (
          <CardProduct key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      <PaginationComponent
        page={currentData?.currentPage ?? 1}
        totalPages={currentData?.totalPages ?? 1}
        totalElements={currentData?.totalElements ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}
