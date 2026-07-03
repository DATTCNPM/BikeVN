import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { vehicleTypeSchema } from "@repo/schemas";
// Tận dụng hook lấy chi nhánh từ hệ thống của bạn
import { useBranches } from "@repo/hooks";
import heroImage from "@/assets/images/background_hero.webp";

export default function Hero() {
  const navigate = useNavigate();

  // Lấy dữ liệu chi nhánh thực tế từ DB
  const { data: branches, isLoading: branchesLoading } = useBranches();

  // State quản lý form tìm kiếm
  const [formData, setFormData] = useState({
    branch: "",
    type: "",
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (formData.branch) params.append("branch", formData.branch);
    if (formData.type) params.append("type", formData.type);

    navigate(`/home?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),linear-gradient(135deg,#000000_0%,#111111_35%,#1f1f1f_60%,#090909_100%)]">
      {/* Glow & Grid Effects */}

      <img
        src={heroImage}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      <div className="z-10 container mx-auto px-6 md:px-12 min-h-screen grid grid-cols-12 items-center gap-8 pt-16">
        {/* Left Content */}
        <div className="max-w-2xl text-white/80 space-y-8 col-span-12 lg:col-span-6">
          <motion.p className="uppercase tracking-[0.3em] mb-4 text-xs md:text-sm text-white/70">
            Premium Vehicle Rental
          </motion.p>
          <div className="overflow-hidden py-1">
            <motion.h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight tracking-tight">
              Drive The Future
            </motion.h1>
          </div>
          <motion.p className="text-lg text-white/90 leading-relaxed">
            Experience premium vehicle rental with a modern, luxurious, and
            convenient style.
          </motion.p>
        </div>

        {/* Right Content: Cải tiến Form Select Động */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-12 lg:col-span-6 w-full flex justify-center lg:justify-end"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-primary">
              Find Your Perfect Ride
            </h3>

            {/* Trường Chọn Chi Nhánh (Động từ useBranches) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">
                Branch Location
              </label>
              <select
                value={formData.branch}
                disabled={branchesLoading}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, branch: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white focus:outline-none focus:border-primary transition disabled:opacity-50"
              >
                <option value="">
                  {branchesLoading ? "Loading branches..." : "Select a branch"}
                </option>
                {/* Map danh sách chi nhánh thực tế từ API */}
                {branches?.map((b: any) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Trường Chọn Loại Động Cơ */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">
                Engine Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white focus:outline-none focus:border-primary transition"
              >
                <option value="">All Engine Types</option>
                <option value={vehicleTypeSchema.enum.electric}>
                  Electric Vehicle
                </option>
                <option value={vehicleTypeSchema.enum.fuel}>
                  Internal Combustion (Fuel)
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={branchesLoading}
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer shadow-lg shadow-primary/20 text-center disabled:opacity-50"
            >
              Search Vehicles
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
