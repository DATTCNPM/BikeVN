import VehicleInfo from "@/components/vehicle/VehicleInfo";
import CardBooking from "@/components/booking/CardBooking";
import { useParams } from "react-router-dom";
export default function VehicleDetail() {
  const { id } = useParams();
  const vehicleId = id || "1"; // Fallback to "1" if id is undefined
  return (
    <div className="w-full grid grid-cols-12 py-8 gap-8">
      <div className="flex flex-col gap-8 col-span-8">
        <VehicleInfo vehicleId={vehicleId} />
      </div>
      <div className="col-span-4">
        <CardBooking />
      </div>
    </div>
  );
}
