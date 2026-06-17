import { useMemo, useState } from "react";

import SearchComponent from "@/components/common/Search";
import Filter from "@repo/ui/components/wrapper/Filter";

import ListVehicle from "../features/home/ListVehicle";
import MapVehicle from "../features/home/MapVehicle";

import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { Spinner } from "@repo/ui/components/ui/spinner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";

import { List, MapPin } from "lucide-react";

import { useVehicles, useBranches, useVehicleFilters } from "@repo/hooks";

import { filterImagePrimary } from "@repo/utils";

import type { VehicleType, VehicleQueryParams } from "@repo/types";

import { vehicleTypeSchema } from "@repo/schemas";

import type { FilterOption } from "@repo/ui/components/wrapper/Filter";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const [selectedBranch, setSelectedBranch] = useState<FilterOption>();

  const [selectedVehicleType, setSelectedVehicleType] =
    useState<FilterOption<VehicleType>>();

  const [minPrice, setMinPrice] = useState<number>();

  const [maxPrice, setMaxPrice] = useState<number>();

  const [selectedPriceRange, setSelectedPriceRange] = useState<FilterOption>();

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const { data: branches = [], isLoading: branchLoading } = useBranches();

  const hasFilter = Boolean(
    search.trim() ||
    selectedBranch ||
    selectedVehicleType ||
    minPrice !== undefined ||
    maxPrice !== undefined,
  );

  const filters = useMemo<VehicleQueryParams>(
    () => ({
      search: search.trim() || undefined,

      currentBranchId: selectedBranch?.value,

      vehicleType: selectedVehicleType?.value,

      minPrice,

      maxPrice,

      page,

      pageSize,
    }),
    [
      search,
      selectedBranch,
      selectedVehicleType,
      minPrice,
      maxPrice,
      page,
      pageSize,
    ],
  );

  const { data: vehicles, isLoading: vehicleLoading } = useVehicles(
    page,
    pageSize,
  );

  const { data: filteredVehicles } = useVehicleFilters(filters, hasFilter);

  const currentData = hasFilter ? filteredVehicles : vehicles;

  const vehicleData = currentData?.data ?? [];

  const pagination = {
    page: currentData?.currentPage ?? 1,
    pageSize: currentData?.pageSize ?? pageSize,
    totalElements: currentData?.totalElements ?? 0,
    totalPages: currentData?.totalPages ?? 1,
  };

  const vehicleListData = useMemo(() => {
    return vehicleData.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      vehicle_type: vehicle.vehicleType,
      price: vehicle.pricePerDay,
      image: filterImagePrimary(vehicle.images || []),
      location:
        branches.find((branch) => branch.id === vehicle.currentBranchId)
          ?.name ?? "Unknown",
      status: vehicle.status,
    }));
  }, [vehicleData, branches]);

  const locationOptions = useMemo(
    () =>
      branches.map((branch) => ({
        label: branch.name,
        value: branch.id,
      })),
    [branches],
  );

  const vehicleTypes = useMemo(
    () => [
      {
        label: "Điện",
        value: vehicleTypeSchema.enum.electric,
      },
      {
        label: "Xăng",
        value: vehicleTypeSchema.enum.fuel,
      },
    ],
    [],
  );

  const priceRanges = useMemo(
    () => [
      {
        label: "Dưới 100k",
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
        label: "Trên 200k",
        value: "over-200",
        min: 200000,
        max: undefined,
      },
    ],
    [],
  );

  const resetFilter = () => {
    setSearch("");

    setSelectedBranch(undefined);

    setSelectedVehicleType(undefined);

    setSelectedPriceRange(undefined);

    setMinPrice(undefined);

    setMaxPrice(undefined);

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
    <div>
      <Tabs defaultValue="list" className="w-full space-y-4">
        <div className="flex items-center justify-center gap-4">
          <SearchComponent
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            results={pagination.totalElements}
          />

          <Filter
            title="Filter by location"
            options={locationOptions}
            value={selectedBranch}
            onChange={(value) => {
              setSelectedBranch(value);
              setPage(1);
            }}
          />

          <Filter<VehicleType>
            title="Filter by vehicle type"
            options={vehicleTypes}
            value={selectedVehicleType}
            onChange={(value) => {
              setSelectedVehicleType(value);
              setPage(1);
            }}
          />

          <Filter
            title="Filter by price range"
            options={priceRanges.map((price) => ({
              label: price.label,
              value: price.value,
            }))}
            value={selectedPriceRange}
            onChange={(value) => {
              setSelectedPriceRange(value);

              const selected = priceRanges.find(
                (price) => price.value === value?.value,
              );

              setMinPrice(selected?.min);
              setMaxPrice(selected?.max);

              setPage(1);
            }}
          />

          <Button variant="outline" onClick={resetFilter}>
            Làm mới
          </Button>

          <TabsList>
            <TabsTrigger value="list">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>

            <TabsTrigger value="map">
              <MapPin className="h-4 w-4" />
              Map
            </TabsTrigger>
          </TabsList>
        </div>

        <Separator />

        <TabsContent value="list">
          <ListVehicle
            vehicles={vehicleListData}
            pagination={pagination}
            onPageChange={setPage}
          />
        </TabsContent>

        <TabsContent value="map">
          <MapVehicle vehicles={vehicleListData} branches={branches} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
