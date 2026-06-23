import CardProduct from "@/components/common/CardProduct";
import PaginationComponent from "@/components/common/PaginationComponent";

import { useMemo, useState } from "react";

import SearchComponent from "@/components/common/Search";

import Filter from "@repo/ui/components/wrapper/Filter";

import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";

import { SlidersHorizontal } from "lucide-react";

import { Spinner } from "@repo/ui/components/ui/spinner";

import {
  useBranches,
  useVehicleBrands,
  useVehicleModels,
  useVehicleFilters,
  useVehicles,
} from "@repo/hooks";

import { vehicleStatusSchema, vehicleTypeSchema } from "@repo/schemas";

import type {
  VehicleCardData,
  VehicleQueryParams,
  VehicleType,
} from "@repo/types";

import type { FilterOption } from "@repo/ui/components/wrapper/Filter";

export default function ListVehicle() {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<FilterOption>();

  const [selectedBrand, setSelectedBrand] = useState<FilterOption>();

  const [selectedModel, setSelectedModel] = useState<FilterOption>();

  const [selectedVehicleType, setSelectedVehicleType] =
    useState<FilterOption<VehicleType>>();

  const [selectedStatus, setSelectedStatus] = useState<FilterOption>();

  const [selectedPriceRange, setSelectedPriceRange] = useState<FilterOption>();

  const { data: branches = [], isLoading: branchLoading } = useBranches();

  const { data: brands } = useVehicleBrands();

  const { data: models } = useVehicleModels();

  const priceRanges = [
    {
      label: "Below 100k",
      value: "under-100",
      min: 0,
      max: 100000,
    },
    {
      label: "100k - 200k",
      value: "100-200",
      min: 100000,
      max: 200000,
    },
    {
      label: "Above 200k",
      value: "over-200",
      min: 200000,
      max: undefined,
    },
  ];

  const selectedPrice = priceRanges.find(
    (item) => item.value === selectedPriceRange?.value,
  );

  const filters = useMemo<VehicleQueryParams>(
    () => ({
      search: search.trim() || undefined,

      currentBranchName: selectedBranch?.value,

      brandName: selectedBrand?.value,

      modelName: selectedModel?.value,

      vehicleType: selectedVehicleType?.value,

      status: selectedStatus?.value as
        | "available"
        | "unavailable"
        | "maintenance"
        | undefined,

      minPrice: selectedPrice?.min,

      maxPrice: selectedPrice?.max,

      page,

      pageSize,
    }),
    [
      search,
      selectedBranch,
      selectedBrand,
      selectedModel,
      selectedVehicleType,
      selectedStatus,
      selectedPrice,
      page,
    ],
  );

  const hasFilter = Boolean(
    search.trim() ||
    selectedBranch ||
    selectedBrand ||
    selectedModel ||
    selectedVehicleType ||
    selectedStatus ||
    selectedPriceRange,
  );

  const { data: vehicles, isLoading: vehicleLoading } = useVehicles(
    page,
    pageSize,
  );

  const { data: filteredVehicles } = useVehicleFilters(filters, hasFilter);

  const currentData = hasFilter ? filteredVehicles : vehicles;

  const vehicleData = currentData?.data ?? [];

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

  const branchOptions = branches.map((branch) => ({
    label: branch.name,
    value: branch.name,
  }));

  const brandOptions =
    brands?.data.map((brand) => ({
      label: brand.name,
      value: brand.name,
    })) ?? [];

  const modelOptions =
    models?.data.map((model) => ({
      label: model.name,
      value: model.name,
    })) ?? [];

  const vehicleTypeOptions = [
    {
      label: "Electric",
      value: vehicleTypeSchema.enum.electric,
    },
    {
      label: "Fuel",
      value: vehicleTypeSchema.enum.fuel,
    },
  ];

  const statusOptions = [
    {
      label: "Available",
      value: vehicleStatusSchema.enum.available,
    },
    {
      label: "Unavailable",
      value: vehicleStatusSchema.enum.unavailable,
    },
    {
      label: "Maintenance",
      value: vehicleStatusSchema.enum.maintenance,
    },
  ];

  const resetFilter = () => {
    setSearch("");

    setSelectedBranch(undefined);

    setSelectedBrand(undefined);

    setSelectedModel(undefined);

    setSelectedVehicleType(undefined);

    setSelectedStatus(undefined);

    setSelectedPriceRange(undefined);

    setPage(1);
  };

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

        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>

          <SheetContent className="overflow-y-auto sm:max-w-md mx-auto">
            <SheetHeader>
              <SheetTitle>Vehicle Filters</SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-4 mx-auto">
              <Filter
                title="Location"
                options={branchOptions}
                value={selectedBranch}
                onChange={(value) => {
                  setSelectedBranch(value);
                  setPage(1);
                }}
              />

              <Filter
                title="Brand"
                options={brandOptions}
                value={selectedBrand}
                onChange={(value) => {
                  setSelectedBrand(value);
                  setPage(1);
                }}
              />

              <Filter
                title="Model"
                options={modelOptions}
                value={selectedModel}
                onChange={(value) => {
                  setSelectedModel(value);
                  setPage(1);
                }}
              />

              <Filter<VehicleType>
                title="Vehicle Type"
                options={vehicleTypeOptions}
                value={selectedVehicleType}
                onChange={(value) => {
                  setSelectedVehicleType(value);
                  setPage(1);
                }}
              />

              <Filter
                title="Status"
                options={statusOptions}
                value={selectedStatus}
                onChange={(value) => {
                  setSelectedStatus(value);
                  setPage(1);
                }}
              />

              <Filter
                title="Price Range"
                options={priceRanges.map((item) => ({
                  label: item.label,
                  value: item.value,
                }))}
                value={selectedPriceRange}
                onChange={(value) => {
                  setSelectedPriceRange(value);
                  setPage(1);
                }}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetFilter}
                >
                  Reset
                </Button>

                <Button className="flex-1" onClick={() => setFilterOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {vehicleCardData.map((vehicle) => (
          <CardProduct key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      <PaginationComponent
        page={filteredVehicles?.currentPage ?? 1}
        totalPages={filteredVehicles?.totalPages ?? 1}
        totalElements={filteredVehicles?.totalElements ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}
