import CardProduct from "@/components/common/CardProduct";
import motorbike1 from "@/assets/images/motorbike1.png";
import motorbike2 from "@/assets/images/motorbike2.png";
import motorbike3 from "@/assets/images/motorbike3.png";
import motorbike4 from "@/assets/images/motorbike4.png";
import PaginationComponent from "@/components/common/PaginationComponent";
export default function ListVehicle() {
  const DataVehicleSample = [
    {
      id: 1,
      title: "Yamaha Exciter 155",
      type: "Xe số",
      price: 150000,
      image: motorbike1,
      location: "Chi nhánh Hà Nội",
      status: "available",
    },
    {
      id: 2,
      title: "Honda Air Blade 125",
      type: "Xe ga",
      price: 120000,
      image: motorbike2,
      location: "Chi nhánh TP.HCM",
      status: "available",
    },
    {
      id: 3,
      title: "Suzuki Raider 150",
      type: "Xe số",
      price: 140000,
      image: motorbike3,
      location: "Chi nhánh Đà Nẵng",
      status: "available",
    },
    {
      id: 4,
      title: "Honda Winner X",
      type: "Xe côn",
      price: 160000,
      image: motorbike4,
      location: "Chi nhánh Hải Phòng",
      status: "available",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {DataVehicleSample.map((vehicle) => (
          <CardProduct
            key={vehicle.id}
            title={vehicle.title}
            type={vehicle.type}
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
