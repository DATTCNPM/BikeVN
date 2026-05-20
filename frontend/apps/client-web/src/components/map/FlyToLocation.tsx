import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
};

export default function FlyToLocation({ lat, lng }: Props) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 16, {
      duration: 1.5,
    });
  }, [lat, lng, map]);

  return null;
}
