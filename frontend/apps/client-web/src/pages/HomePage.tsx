import ListVehicle from "../features/home/ListVehicle";
import MapVehicle from "../features/home/MapVehicle";
import { List, MapPin } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";

export default function HomePage() {
  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="list" className="w-full">
        {/* Header ẩn của trang chủ: Chứa tiêu đề và nút chuyển List/Map song song */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome to BikeVN
            </h1>
            <p className="text-sm text-muted-foreground">
              Your Ultimate Vehicle Rental Platform
            </p>
          </div>

          <TabsList className="p-1 bg-secondary rounded-full h-10 w-full sm:w-[200px] shrink-0">
            <TabsTrigger
              value="list"
              className="rounded-full h-8 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <List className="mr-1.5 h-3.5 w-3.5" />
              List View
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="rounded-full h-8 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              Map View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="mt-2 focus-visible:outline-none">
          <ListVehicle />
        </TabsContent>

        <TabsContent value="map" className="focus-visible:outline-none">
          <MapVehicle />
        </TabsContent>
      </Tabs>
    </div>
  );
}
