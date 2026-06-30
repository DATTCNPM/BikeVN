import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
};

export default function FlyToLocation({ lat, lng }: Props) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 15, {
      duration: 1.2, // Tăng tốc độ bay một xíu để trải nghiệm mượt mà hơn
    });
  }, [lat, lng, map]);

  return null;
}
