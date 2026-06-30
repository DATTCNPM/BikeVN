import { cn } from "../../lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 select-none",
        className,
      )}
      {...props}
    >
      {/* Wrapper chứa chiếc xe */}
      <div className="relative w-16 h-12 flex items-center justify-center">
        {/* Icon/SVG Chiếc xe máy (Được animate nhún nhảy bằng CSS) */}
        <svg
          className="w-12 h-12 text-primary animate-[bounce_1s_infinite_ease-in-out]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Khung xe & Tay lái */}
          <path d="M5 17h6l3-5h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5" />
          <path d="M14 12V8a2 2 0 0 1 2-2h2" />
          <path d="M16 6h3" />

          {/* Bánh xe sau (Animate quay tròn) */}
          <circle
            cx="5"
            cy="17"
            r="2.5"
            className="animate-[spin_0.6s_infinite_linear] origin-[5px_17px]"
          />
          <path
            d="M5 14.5v5"
            className="animate-[spin_0.6s_infinite_linear] origin-[5px_17px]"
          />

          {/* Bánh xe trước (Animate quay tròn) */}
          <circle
            cx="19"
            cy="17"
            r="2.5"
            className="animate-[spin_0.6s_infinite_linear] origin-[19px_17px]"
          />
          <path
            d="M19 14.5v5"
            className="animate-[spin_0.6s_infinite_linear] origin-[19px_17px]"
          />
        </svg>

        {/* Vệt gió/khói phía sau xe tạo cảm giác đang lao về phía trước */}
        <div className="absolute left-0 top-5 space-y-1">
          <div className="w-3 h-[2px] bg-primary/40 rounded-full animate-[ping_0.8s_infinite_linear]" />
          <div className="w-2 h-[2px] bg-white/30 rounded-full animate-[ping_0.6s_infinite_linear] delay-100" />
        </div>
      </div>

      {/* Chữ Loading nhỏ tinh tế chuẩn UI */}
      <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/50 animate-pulse">
        Riding...
      </span>
    </div>
  );
}

export { Spinner };
