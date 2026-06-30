import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup,
  Marker,
  useMap,
} from "react-leaflet";
import type { Branch } from "@repo/types";
import FlyToLocation from "./FlyToLocation";
import { useEffect, useState } from "react";
import vietnamIslandsGeoJSON from "@/assets/vietnam.geojson?url";

type MapProps = {
  locations: Branch[];
  selectedBranchId?: string;
  onSelectBranch?: (branch: Branch) => void;
  currentTab?: string; // Nhận prop kiểm tra trạng thái tab từ component cha
};

// Sub-component sửa lỗi vỡ kích thước map khi chuyển tab
function ResizeMap({ isVisible }: { isVisible: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (isVisible) {
      // Chờ 50ms cho DOM của tab hoàn toàn render xong chiều cao rồi ép map vẽ lại đúng kích thước
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible, map]);

  return null;
}

export default function Map({
  locations,
  selectedBranchId,
  onSelectBranch,
  currentTab,
}: MapProps) {
  const selectedBranch = locations.find((b) => b.id === selectedBranchId);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch(vietnamIslandsGeoJSON)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Lỗi tải bản đồ chủ quyền:", err));
  }, []);

  const onEachIsland = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(`<b>${feature.properties.name} (Việt Nam)</b>`, {
        className: "island-tooltip",
        sticky: true,
        direction: "top",
      });
    }

    layer.on({
      mouseout: (e: any) => {
        e.target.setStyle({
          fillColor: "#3b82f6",
          fillOpacity: 0.25,
          weight: 1.5,
          color: "#60a5fa",
        });
      },
    });
  };

  return (
    <MapContainer
      center={[16.0, 108.0]}
      zoom={5.5}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      {/* Kích hoạt tính năng sửa lỗi tính toán size khi mở Tab Location */}
      <ResizeMap isVisible={currentTab === "location"} />

      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {geoData && (
        <GeoJSON
          data={geoData}
          style={{
            color: "#60a5fa",
            weight: 1.5,
            fillColor: "#3b82f6",
            fillOpacity: 0.25,
          }}
          onEachFeature={onEachIsland}
        />
      )}

      {locations.map((branch) => (
        <Marker
          key={branch.id}
          position={[branch.lat, branch.lng]}
          eventHandlers={{ click: () => onSelectBranch?.(branch) }}
        >
          <Popup>
            <div className="font-semibold text-sm p-0.5">{branch.name}</div>
          </Popup>
        </Marker>
      ))}

      {selectedBranch && (
        <FlyToLocation lat={selectedBranch.lat} lng={selectedBranch.lng} />
      )}
    </MapContainer>
  );
}
