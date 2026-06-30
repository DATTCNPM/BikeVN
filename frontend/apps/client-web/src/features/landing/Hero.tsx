import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VehicleGallery from "@/features/vehicle/VehicleGallery";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),linear-gradient(135deg,#000000_0%,#111111_35%,#1f1f1f_60%,#090909_100%)]">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      {/* Content */}
      <div className="z-10 container mx-auto px-6 md:px-12 min-h-screen grid grid-cols-12 items-center gap-8 pt-16">
        {/* Left Content (Text Content) */}
        <div className="max-w-2xl text-white/80 space-y-8 col-span-12 lg:col-span-6">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="uppercase tracking-[0.3em] mb-4 text-xs md:text-sm text-white/50"
          >
            Premium Vehicle Rental
          </motion.p>

          {/* Text Reveal Effect cho Title */}
          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
              className="text-5xl md:text-6xl font-bold text-primary leading-tight tracking-tight"
            >
              Drive The Future
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-white/60 leading-relaxed"
          >
            Experience premium vehicle rental with a modern, luxurious, and
            convenient style.
          </motion.p>

          {/* Interactive Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-4 mt-8"
          >
            <button
              className="px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-lg shadow-primary/20"
              onClick={() => navigate("/home")}
            >
              Rent Now
            </button>
            <button
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md text-white font-semibold hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/home")}
            >
              Discover More
            </button>
          </motion.div>
        </div>

        {/* Right Content (Gallery) - Đắp hiệu ứng Fade-in mượt kết hợp Scale nhẹ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="col-span-12 lg:col-span-6 w-full"
        >
          <div className="relative group rounded-3xl overflow-hidden border border-white/5 bg-white/[0.01]">
            <VehicleGallery showThumbnail={false} images={[]} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
