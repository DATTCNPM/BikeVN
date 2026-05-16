import SearchComponent from "@/components/common/Search";
import Filter from "@/components/common/Filter";
import ListVehicle from "../components/home/ListVehicle";
import MapVehicle from "../components/home/MapVehicle";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { List, MapPin } from "lucide-react";
export default function HomePage() {
  const locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng"];
  const vehicleTypes = ["Xe số", "Xe ga", "Xe côn"];
  const priceRanges = ["Dưới 100k", "100k - 200k", "Trên 200k"];
  return (
    <div>
      <Tabs defaultValue="list" className="w-full space-y-4">
        <div className="flex items-center justify-center gap-4">
          <SearchComponent results={42} />
          <Filter title="Filter by location" content={locations} />
          <Filter title="Filter by vehicle type" content={vehicleTypes} />
          <Filter title="Filter by price range" content={priceRanges} />
          <Button variant="outline">Làm mới</Button>

          <TabsList>
            <TabsTrigger value="list">
              <List className="w-4 h-4" /> List
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapPin className="w-4 h-4" /> Map
            </TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">Hiển thị 42 xe</p>
        </div>

        <Separator />
        <TabsContent value="list">
          <ListVehicle />
        </TabsContent>
        <TabsContent value="map">
          <MapVehicle />
        </TabsContent>
      </Tabs>
    </div>
  );
}
