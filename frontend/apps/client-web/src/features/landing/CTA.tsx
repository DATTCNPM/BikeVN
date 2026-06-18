export default function CTA() {
  const stats = [
    {
      value: "10K+",
      label: "Trusted Customers",
    },
    {
      value: "500+",
      label: "Diverse Bike Selection",
    },
    {
      value: "24/7",
      label: "Customer Support",
    },
  ];
  return (
    <section className="relative z-10 container mx-auto px-20">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] backdrop-blur-2xl px-8 py-20 md:px-16">
        {/* Inner Glow */}
        <div className="absolute top-0 right-0 bg-white/[0.08] blur-2xl rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <p className="text-white/50 uppercase tracking-[0.3em] text-sm">
              Premium Experience
            </p>

            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Ready for your next adventure?
            </h2>
          </div>

          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Discover hundreds of high-quality bikes with a fast, transparent,
            and modern rental process.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="
              px-8 py-4
              rounded-2xl
              bg-primary
              text-primary-foreground
              font-semibold
              hover:bg-primary/90
              transition-all duration-300
            "
            >
              Rent Now
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
            "
            >
              Discover More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                p-6
              "
              >
                <h3 className="text-3xl font-bold text-primary">
                  {item.value}
                </h3>

                <p className="mt-2 text-white/50">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
