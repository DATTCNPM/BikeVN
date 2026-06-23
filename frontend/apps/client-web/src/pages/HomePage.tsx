import ListVehicle from "../features/home/ListVehicle";
import MapVehicle from "../features/home/MapVehicle";
import { Separator } from "@repo/ui/components/ui/separator";

import { List, MapPin } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";

export default function HomePage() {
  return (
    <Tabs defaultValue="list" className="space-y-4">
      <TabsList className="w-[200px]">
        <TabsTrigger value="list" className="w-full">
          <List className="mr-2 h-4 w-4" />
          List
        </TabsTrigger>
        <TabsTrigger value="map" className="w-full">
          <MapPin className="mr-2 h-4 w-4" />
          Map
        </TabsTrigger>
      </TabsList>
      

      <TabsContent value="list">
        <ListVehicle />
      </TabsContent>

      <TabsContent value="map">
        <MapVehicle  />
      </TabsContent>
    </Tabs>
  );
}
