export default function Card({
  title,
  desc,
  icon,
  step,
  index,
}: {
  title: string;
  desc: string;
  icon?: React.ReactNode;
  step?: string;
  index: number;
}) {
  return (
    <div
      key={index}
      className="
            group
            relative
            overflow-hidden
            rounded-3xl
            border border-white/10
            bg-white/[0.03]
            backdrop-blur-xl
            p-8
            hover:bg-white/[0.05]
            hover:border-white/20
            transition-all duration-300
          "
    >
      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative z-10 text-secondary">
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">
          {icon ? icon : <span className="text-xl font-bold">{step}</span>}
        </div>

        <h3 className="text-xl font-semibold mb-4">{title}</h3>

        <p className="text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
