import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { Branch } from "@repo/types";

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
  const selectedBranch = locations.find(
    (branch) => branch.id === selectedBranchId,
  );

  return (
    <MapContainer
      center={[10.045, 105.746]}
      zoom={13}
      style={{ height: "70vh", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((branch) => (
        <Marker
          key={branch.id}
          position={[branch.lat, branch.lng]}
          eventHandlers={{
            click: () => onSelectBranch?.(branch),
          }}
        >
          <Popup>{branch.name}</Popup>
        </Marker>
      ))}

      {selectedBranch && (
        <FlyToLocation lat={selectedBranch.lat} lng={selectedBranch.lng} />
      )}
    </MapContainer>
  );
}
