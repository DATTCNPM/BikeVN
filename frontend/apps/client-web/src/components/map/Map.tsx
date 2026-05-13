import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Branch } from "@/lib/types";
import FlyToLocation from "./FlyToLocation";
type MapProps = {
  locations: Branch[];
  selectedBranchId?: string;
  onSelectBranch?: (branch: Branch) => void;
};
export default function Map({
  locations,
  selectedBranchId,
  onSelectBranch,
}: MapProps) {
  return (
    <MapContainer
      center={[10.045, 105.746]}
      zoom={13}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((item) => (
        <Marker
          key={item.id}
          position={[item.lat, item.lng]}
          eventHandlers={{
            click: () => {
              if (onSelectBranch) {
                onSelectBranch(item);
              }
            },
          }}
        >
          <Popup>{item.name}</Popup>
        </Marker>
      ))}
      {selectedBranchId && (
        <FlyToLocation
          lat={locations.find((l) => l.id === selectedBranchId)?.lat || 0}
          lng={locations.find((l) => l.id === selectedBranchId)?.lng || 0}
        />
      )}
    </MapContainer>
  );
}
