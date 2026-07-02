import { useMemo, useState } from "react";
import CardProduct from "@/components/common/CardProduct";
import PaginationComponent from "@/components/common/PaginationComponent";
import SearchComponent from "@/components/common/Search";
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";

import { useVehicleFilters, useVehicles } from "@repo/hooks";
import { vehicleStatusSchema, vehicleTypeSchema } from "@repo/schemas";
import type { VehicleCardData, VehicleQueryParams, Vehicle } from "@repo/types";
import { useDebounce } from "@repo/hooks";

import { motion } from "framer-motion";
import {
  MOTION_LIST_CONTAINER,
  MOTION_LIST_ITEM,
  INTERACT_CARD_HOVER,
} from "@repo/utils";

import ListVehiclePageSkeleton from "./ListVehiclePageSkeleton";

import { PRICE_RANGES } from "@repo/constants";

export default function ListVehicle() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  // Chủ động set mặc định chỉ tìm các xe có trạng thái Available
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({
    status: {
      label: "Available Now",
      value: vehicleStatusSchema.enum.available,
    },
  });

  // Ô input gõ cập nhật searchQuery liên tục, nhưng debouncedQuery thì 1000ms sau mới đổi
  const debouncedQuery = useDebounce(search, 1000);

  // 1. Fetch main fleet and handle active filter state switching
  // Vì mặc định đã có filter status nên luồng dữ liệu chính sẽ đi qua useVehicleFilters bên dưới
  const { data: vehicles, isLoading: vehicleLoading } = useVehicles(page, size);

  const activePriceRange = PRICE_RANGES.find(
    (p) => p.value === selectedFilters["priceRange"]?.value,
  );

  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );

  const apiFilters = useMemo<VehicleQueryParams>(
    () => ({
      name: debouncedQuery.trim() || undefined,
      currentBranchName: selectedFilters["branch"]?.value,
      brandName: selectedFilters["brand"]?.value,
      modelName: selectedFilters["model"]?.value,
      vehicleType: selectedFilters["type"]?.value,
      status: selectedFilters["status"]?.value, // Sẽ luôn gửi "available" trừ khi bị ghi đè hoặc xóa
      minPrice: activePriceRange?.min,
      maxPrice: activePriceRange?.max,
      page,
      size,
    }),
    [debouncedQuery, selectedFilters, activePriceRange, page],
  );

  const { data: filteredVehicles, isLoading: filterLoading } =
    useVehicleFilters(apiFilters, hasFilter);

  // Determine the primary source of truth data stream
  const currentData = hasFilter ? filteredVehicles : vehicles;
  const rawVehicleList: Vehicle[] = currentData?.data ?? [];

  // 2. Derive dynamic options for Advanced Filters using existing payload metadata
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    const uniqueBranches = Array.from(
      new Set(rawVehicleList.map((v) => v.currentBranchName).filter(Boolean)),
    );
    const uniqueBrands = Array.from(
      new Set(rawVehicleList.map((v) => v.brandName).filter(Boolean)),
    );
    const uniqueModels = Array.from(
      new Set(rawVehicleList.map((v) => v.modelName).filter(Boolean)),
    );

    return [
      {
        key: "branch",
        title: "Branch Location",
        options: uniqueBranches.map((name) => ({ label: name, value: name })),
      },
      {
        key: "brand",
        title: "Brand / Maker",
        options: uniqueBrands.map((name) => ({ label: name, value: name })),
      },
      {
        key: "model",
        title: "Model Name",
        options: uniqueModels.map((name) => ({ label: name, value: name })),
      },
      {
        key: "type",
        title: "Engine Type",
        options: [
          { label: "Electric Vehicle", value: vehicleTypeSchema.enum.electric },
          {
            label: "Internal Combustion (Fuel)",
            value: vehicleTypeSchema.enum.fuel,
          },
        ],
      },
      {
        key: "status",
        title: "Availability Status",
        options: [
          { label: "Available Now", value: vehicleStatusSchema.enum.available },
          {
            label: "Unavailable / Booked",
            value: vehicleStatusSchema.enum.unavailable,
          },
          {
            label: "Under Maintenance",
            value: vehicleStatusSchema.enum.maintenance,
          },
        ],
      },
      {
        key: "priceRange",
        title: "Daily Rate Range",
        options: PRICE_RANGES.map((p) => ({ label: p.label, value: p.value })),
      },
    ];
  }, [rawVehicleList]);

  // ✨ ĐỔI THÀNH QUICK LOCATIONS: Lấy danh sách chi nhánh duy nhất từ data trả về
  const availableQuickLocations = useMemo<string[]>(() => {
    return Array.from(
      new Set(rawVehicleList.map((v) => v.currentBranchName).filter(Boolean)),
    );
  }, [rawVehicleList]);

  // 3. Process và map dữ liệu (ĐÃ BỎ SORT STATUS)
  const vehicleCardData = useMemo<VehicleCardData[]>(() => {
    return rawVehicleList.map((vehicle) => ({
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
  }, [rawVehicleList]);

  // ✨ ĐỔI THÀNH XỬ LÝ CHỌN QUICK LOCATION
  const handleQuickLocationSelect = (branchName: string) => {
    setSelectedFilters((prev) => {
      const isSelected = prev["branch"]?.value === branchName;
      return {
        ...prev,
        branch: isSelected
          ? undefined
          : { label: branchName, value: branchName },
      };
    });
    setPage(1);
  };

  if (vehicleLoading || (hasFilter && filterLoading)) {
    return <ListVehiclePageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* SEARCH BAR & FILTERS WRAPPER */}
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
            // Reset về trạng thái mặc định ban đầu (chỉ lấy xe Available)
            setSelectedFilters({
              status: {
                label: "Available Now",
                value: vehicleStatusSchema.enum.available,
              },
            });
            setPage(1);
          }}
        />
      </div>

      {/* ✨ QUICK LOCATIONS CHIPS SELECTOR BAR */}
      {availableQuickLocations.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mask-linear-r">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2 shrink-0">
            Quick Locations:
          </span>
          {availableQuickLocations.map((branchName) => {
            const isTarget = selectedFilters["branch"]?.value === branchName;
            return (
              <button
                key={branchName}
                onClick={() => handleQuickLocationSelect(branchName)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 shrink-0 ${
                  isTarget
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {branchName}
              </button>
            );
          })}
        </div>
      )}

      {/* VEHICLES PRODUCT CARD GRID */}
      {vehicleCardData.length > 0 ? (
        <motion.div
          variants={MOTION_LIST_CONTAINER}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {vehicleCardData.map((vehicle) => (
            <motion.div
              variants={MOTION_LIST_ITEM}
              whileHover={INTERACT_CARD_HOVER}
              key={vehicle.id}
              className="will-change-transform"
            >
              <CardProduct vehicle={vehicle} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-3xl border-border/60"
        >
          <p className="text-muted-foreground font-medium">
            No vehicles match your selected search criteria.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedFilters({
                status: {
                  label: "Available Now",
                  value: vehicleStatusSchema.enum.available,
                },
              });
            }}
            className="mt-3 text-xs text-primary font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </motion.div>
      )}

      {/* COMPONENT PAGINATION LAYER */}
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
