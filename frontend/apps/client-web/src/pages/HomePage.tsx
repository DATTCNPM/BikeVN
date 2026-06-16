import { useMemo, useState } from "react";

import SearchComponent from "@/components/common/Search";
import Filter from "@/components/common/Filter";

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
import type { VehicleType } from "@repo/types";
import { vehicleTypeSchema } from "@repo/schemas";
export default function HomePage() {
  const [search, setSearch] = useState("");

  const [branchId, setBranchId] = useState<string | undefined>();

  const [vehicleType, setVehicleType] = useState<VehicleType | undefined>();

  const [minPrice, setMinPrice] = useState<number | undefined>();

  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const [priceRange, setPriceRange] = useState<string>();

  const [page, setPage] = useState(1);

  const pageSize = 10

  const { data: vehicles, isLoading } = useVehicles(page, pageSize);

  const hasFilter =
    search ||
    branchId ||
    vehicleType ||
    minPrice !== undefined ||
    maxPrice !== undefined;
  const filters = {
    search,
    branchId,
    vehicleType,
    minPrice,
    maxPrice,
    page,
    pageSize,
  };

  const { data: filteredVehicles } = useVehicleFilters(filters, {
    enabled: hasFilter,
  });

  const { data: branches = [], isLoading: branchLoading } = useBranches();

  const vehicleData = hasFilter
    ? (filteredVehicles?.data ?? [])
    : (vehicles?.data ?? []);

  const vehicleListData = useMemo(() => {
    return vehicleData
      ? vehicleData.map((vehicle) => ({
          id: vehicle.id,
          name: vehicle.name,
          vehicle_type: vehicle.vehicleType,
          price: vehicle.pricePerDay,
          image: filterImagePrimary(vehicle?.images || []),
          location:
            branches.find((branch) => branch.id === vehicle.currentBranchId)
              ?.name || "Unknown",
          status: vehicle.status,
        }))
      : [];
  }, [vehicleData, branches]);

  const pagination = {
    page: vehicles?.pageCurrent ?? 1,
    pageSize: vehicles?.pageSize ?? pageSize,
    totalElements: vehicles?.totalElements ?? 0,
    totalPages: vehicles?.totalPages ?? 1,
  };

  const resetFilter = () => {
    setSearch("");
    setBranchId(undefined);
    setVehicleType(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPage(1);
  };

  if (isLoading || branchLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const locationOptions = branches.map((branch) => ({
    label: branch.name,
    value: branch.id,
  }));

  const priceRanges = [
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
  ];

  const vehicleTypes = [
    {
      label: "Điện",
      value: vehicleTypeSchema.enum.electric,
    },
    {
      label: "Xăng",
      value: vehicleTypeSchema.enum.fuel,
    },
  ];

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
            value={branchId}
            onChange={(value) => {
              const branch = branches.find((b) => b.id === value);

              setBranchId(branch?.id);
              setPage(1);
            }}
          />

          <Filter
            title="Filter by vehicle type"
            options={vehicleTypes}
            value={vehicleType}
            onChange={(value) => {
              setVehicleType(value as VehicleType);
              setPage(1);
            }}
          />

          <Filter
  title="Filter by price range"
  options={priceRanges.map((p) => ({
    label: p.label,
    value: p.value,
  }))}
  value={priceRange}
  onChange={(value) => {
    setPriceRange(value);

    const selected = priceRanges.find(
      (range) => range.value === value,
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
              <List className="w-4 h-4" />
              List
            </TabsTrigger>

            <TabsTrigger value="map">
              <MapPin className="w-4 h-4" />
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
