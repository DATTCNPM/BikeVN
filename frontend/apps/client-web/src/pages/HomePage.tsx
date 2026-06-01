import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import SearchComponent from "@/components/common/Search";
import Filter from "@/components/common/Filter";

import ListVehicle from "../components/home/ListVehicle";
import MapVehicle from "../components/home/MapVehicle";

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

import { useVehicles, useBranches } from "@repo/hooks";
import type { VehicleImage } from "@repo/types";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const [branchId, setBranchId] = useState<string | undefined>();

  const [vehicleType, setVehicleType] = useState<string | undefined>();

  const [minPrice, setMinPrice] = useState<number | undefined>();

  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const [page, setPage] = useState(1);

  const pageSize = 12;

  const {
    data: vehicles = [],
    isLoading,
    error,
  } = useVehicles({
    search,
    branchId,
    vehicleType,
    minPrice,
    maxPrice,
    page,
    pageSize,
  });

  const {
    data: branches = [],
    isLoading: branchLoading,
    error: branchError,
  } = useBranches();

  useEffect(() => {
    if (error) {
      toast.error("Lấy danh sách xe thất bại");
    }
  }, [error]);

  useEffect(() => {
    if (branchError) {
      toast.error("Lấy danh sách chi nhánh thất bại");
    }
  }, [branchError]);

  const filterImagePrimary = (images: VehicleImage[]) => {
    const primaryImage = images.find((img) => img.isPrimary === true);
    return primaryImage ? primaryImage.imageUrl : "";
  };

  const vehicleListData = useMemo(() => {
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      vehicle_type: vehicle.vehicleType,
      price: vehicle.pricePerDay,
      image: filterImagePrimary(vehicle.images),
      location:
        branches.find((branch) => branch.id === vehicle.currentBranchId)
          ?.name || "Unknown",
      status: vehicle.status,
    }));
  }, [vehicles, branches]);

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

  const locations = branches.map((b) => b.name);

  const vehicleTypes = ["Xe số", "Xe ga", "Xe côn"];

  const priceRanges = ["Dưới 100k", "100k - 200k", "Trên 200k"];

  console.log("vehicles", vehicleListData);

  return (
    <div>
      <Tabs defaultValue="list" className="w-full space-y-4">
        <div className="flex items-center justify-center gap-4">
          <SearchComponent
            value={search}
            onChange={setSearch}
            results={vehicleListData.length}
          />

          <Filter title="Filter by location" content={locations} />

          <Filter title="Filter by vehicle type" content={vehicleTypes} />

          <Filter title="Filter by price range" content={priceRanges} />

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

          <p className="text-sm text-muted-foreground">
            Hiển thị {vehicleListData.length} xe
          </p>
        </div>

        <Separator />

        <TabsContent value="list">
          <ListVehicle vehicles={vehicleListData} />
        </TabsContent>

        <TabsContent value="map">
          <MapVehicle vehicles={vehicleListData} branches={branches} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
