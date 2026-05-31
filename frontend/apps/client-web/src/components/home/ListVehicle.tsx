import CardProduct from "@/components/common/CardProduct";
import PaginationComponent from "@/components/common/PaginationComponent";

interface VehicleCardData {
  id: string;
  name: string;
  vehicle_type: string;
  price: number;
  image: string;
  location: string;
  status: string;
}

interface ListVehicleProps {
  vehicles: VehicleCardData[];
}

export default function ListVehicle({ vehicles }: ListVehicleProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {vehicles.map((vehicle) => (
          <CardProduct
            key={vehicle.id}
            id={vehicle.id}
            title={vehicle.name}
            type={vehicle.vehicle_type}
            price={vehicle.price}
            image={vehicle.image}
            location={vehicle.location}
            status={vehicle.status}
          />
        ))}
      </div>

      <PaginationComponent />
    </>
  );
}
