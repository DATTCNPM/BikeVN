import { motion } from "framer-motion";

export default function CTA() {
  const stats = [
    { value: "10K+", label: "Trusted Customers" },
    { value: "500+", label: "Diverse Bike Selection" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <section className="relative z-10 container mx-auto px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] backdrop-blur-2xl px-6 py-16 md:px-16 md:py-20"
      >
        {/* Inner Glow tinh chỉnh mượt hơn */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/[0.04] blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <p className="text-white/40 uppercase tracking-[0.3em] text-xs md:text-sm">
              Premium Experience
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Ready for your next adventure?
            </h2>
          </div>

          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Discover hundreds of high-quality bikes with a fast, transparent,
            and modern rental process.
          </p>

          {/* Buttons Micro-interactions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-lg shadow-primary/10">
              Rent Now
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md text-white font-semibold hover:bg-white/[0.06] hover:border-white/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300">
              Discover More
            </button>
          </div>

          {/* Stats Section trồi nhẹ lần lượt */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            {stats.map((item, index) => (
              <motion.div
                key={`stat-${index}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-white/10 transition-colors"
              >
                <h3 className="text-3xl font-extrabold text-primary tracking-tight">
                  {item.value}
                </h3>
                <p className="mt-2 text-sm text-white/50 font-medium">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
