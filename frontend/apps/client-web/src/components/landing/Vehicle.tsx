import CardProduct from "@/components/common/CardProduct";
import motorbike1 from "@/assets/images/motorbike1.png";
import motorbike2 from "@/assets/images/motorbike2.png";
import motorbike3 from "@/assets/images/motorbike3.png";
export default function Vehicle() {
  const DataVehicleSample = [
    {
      id: "1",
      title: "Yamaha Exciter 155",
      type: "Xe số",
      price: 150000,
      image: motorbike1,
      location: "Chi nhánh Hà Nội",
      status: "available",
    },
    {
      id: "2",
      title: "Honda Air Blade 125",
      type: "Xe ga",
      price: 120000,
      image: motorbike2,
      location: "Chi nhánh TP.HCM",
      status: "available",
    },
    {
      id: "3",
      title: "Suzuki Raider 150",
      type: "Xe số",
      price: 140000,
      image: motorbike3,
      location: "Chi nhánh Đà Nẵng",
      status: "available",
    },
  ];
  return (
    <section id="vehicles" className="space-y-16">
      <h2 className="text-3xl text-center font-bold text-primary mb-8">
        Dòng xe nổi bật
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DataVehicleSample.map((vehicle) => (
          <CardProduct
            key={vehicle.id}
            id={vehicle.id}
            title={vehicle.title}
            type={vehicle.type}
            price={vehicle.price}
            location={vehicle.location}
            status={vehicle.status}
            image={vehicle.image}
          />
        ))}
      </div>
    </section>
  );
}
