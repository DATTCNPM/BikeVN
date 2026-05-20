import VehicleGallery from "@/components/vehicle/VehicleGallery";
import { useNavigate } from "react-router-dom";

import motorbike1 from "../../assets/images/motorbike1.png";
import motorbike2 from "../../assets/images/motorbike2.png";
import motorbike3 from "../../assets/images/motorbike3.png";
import motorbike4 from "../../assets/images/motorbike4.png";

const images = [motorbike1, motorbike2, motorbike3, motorbike4];
export default function Hero() {
  const navigate = useNavigate();
  return (
    <section
      className="
    relative
    overflow-hidden
    min-h-screen
    bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),linear-gradient(135deg,#000000_0%,#111111_35%,#1f1f1f_60%,#090909_100%)]
  "
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[140px] rounded-full" />

      {/* Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Content */}
      <div className="z-10 container mx-auto px-6 min-h-screen grid grid-cols-12 items-center gap-8">
        <div className="max-w-2xl text-white/80 space-y-8 col-span-6">
          <p className="uppercase tracking-[0.3em] mb-4">
            Premium Vehicle Rental
          </p>

          <h1 className="text-6xl font-bold text-primary leading-tight">
            Drive The Future
          </h1>

          <p className="text-lg text-white/80 leading-relaxed">
            Trải nghiệm dịch vụ thuê xe cao cấp với phong cách hiện đại, sang
            trọng và tiện lợi.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              className="
              px-8 py-4
              rounded-2xl
              
              bg-primary
              backdrop-blur-md
              text-white
              hover:bg-primary/90
              
              transition-all duration-300
              cursor-pointer
            "
              onClick={() => navigate("/home")}
            >
              Thuê xe ngay
            </button>
            <button
              className="
              px-8 py-4
              rounded-2xl
              border border-white/10
              bg-white/[0.03]
              backdrop-blur-md
              text-white
              hover:bg-white/[0.06]
              hover:border-white/20
              transition-all duration-300
              cursor-pointer
            "
              onClick={() => navigate("/home")}
            >
              Khám phá thêm
            </button>
          </div>
        </div>
        <div className="col-span-6">
          <VehicleGallery showThumbnail={false} images={images} />
        </div>
      </div>
    </section>
  );
}
