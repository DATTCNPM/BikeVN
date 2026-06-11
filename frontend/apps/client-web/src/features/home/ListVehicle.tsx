import CardProduct from "@/components/common/CardProduct";
import PaginationComponent from "@/components/common/PaginationComponent";

interface VehicleCardData {
  id: string;
  name: string;
  vehicle_type: string;
  price: number;
  image: string | null;
  location: string;
  status: string;
}
type Pagination = {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};

interface ListVehicleProps {
  vehicles: VehicleCardData[];
  pagination: Pagination;
}

export default function ListVehicle({
  vehicles,
  pagination,
  onPageChange,
}: ListVehicleProps & { onPageChange: (page: number) => void }) {
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

      <PaginationComponent
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        onPageChange={onPageChange}
      />
    </>
  );
}
