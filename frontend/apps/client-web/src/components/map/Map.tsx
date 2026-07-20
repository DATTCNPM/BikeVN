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

// --- CẬP NHẬT ĐOẠN FIX LỖI ỔN ĐỊNH CHO CẢ LOCAL VÀ PRODUCTION ---
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Kích thước mặc định của marker leaflet
  iconAnchor: [12, 41], // Điểm neo chân marker
  popupAnchor: [1, -34], // Vị trí hiển thị popup so với icon
  shadowSize: [41, 41], // Kích thước đổ bóng
});
// ----------------------------------------------------------------

type MapProps = {
  locations: Branch[];
  selectedBranchId?: string;
  onSelectBranch?: (branch: Branch) => void;
  currentTab?: string;
};

// Sub-component sửa lỗi vỡ kích thước map khi chuyển tab
function ResizeMap({ isVisible }: { isVisible: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (isVisible) {
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
          icon={customIcon} // <--- TRUYỀN CUSTOM ICON VÀO ĐÂY
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
