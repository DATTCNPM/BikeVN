import { motion } from "framer-motion";
import { type ReactNode, useMemo } from "react";

type AuthBackgroundProps = {
  children: ReactNode;
};

// 1. Giữ nguyên mảng mảnh kim loại tĩnh ngoài component
const metalShards = Array.from({ length: 20 }).map((_, i) => {
  const orbit = 420 + Math.random() * 720;
  return {
    id: i,
    size: 40 + Math.random() * 90,
    orbit,
    duration: 20 + orbit / 35,
    delay: -Math.random() * 30,
    rotate: Math.random() * 360,
    top: `${Math.random() * 18}%`,
    opacity: 0.35 + Math.random() * 0.45,
    blur: orbit > 850 ? 1.2 : orbit > 650 ? 0.8 : 0.3,
    // Tối ưu: Tính toán trước thời gian nhún nhảy tại đây để tránh random lại khi re-render
    floatDuration: 10 + Math.random() * 8,
  };
});

function MetalShard({
  size,
  orbit,
  duration,
  delay,
  rotate,
  top,
  opacity,
  blur,
  floatDuration,
}: (typeof metalShards)[0]) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform" // Tối ưu bật tăng tốc phần cứng (GPU)
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      style={{
        width: orbit * 2,
        height: orbit * 2,
        marginLeft: -orbit,
        marginTop: -orbit,
      }}
    >
      <motion.div
        className="absolute left-1/2 will-change-transform"
        style={{
          top,
          transform: "translateX(-50%)",
        }}
        animate={{
          rotate: [rotate, rotate + 12, rotate - 10, rotate],
          y: [0, -8, 6, 0],
          x: [0, 4, -3, 0],
        }}
        transition={{
          duration: floatDuration, // Dùng giá trị cố định đã tính trước
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className="relative"
          style={{
            width: size,
            height: size * 0.42,
            opacity,
            filter: `blur(${blur}px)`,
          }}
        >
          {/* Main metal shard */}
          <div
            className="absolute inset-0 border border-white/10 shadow-[0_0_30px_rgba(250,204,21,0.08)]"
            style={{
              clipPath:
                "polygon(0% 62%, 10% 38%, 22% 0%, 70% 8%, 100% 48%, 82% 100%, 24% 86%)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(161,161,170,0.92) 18%, rgba(82,82,91,0.88) 42%, rgba(24,24,27,0.95) 100%)",
              transform: `rotate(${rotate}deg)`,
            }}
          />

          {/* Edge highlight */}
          <div
            className="absolute left-[14%] top-[18%] h-[2px] w-[38%] bg-white/80 blur-[1px]"
            style={{ transform: `rotate(${rotate + 10}deg)` }}
          />

          {/* Golden reflection */}
          <div
            className="absolute right-[16%] top-[52%] h-[1px] w-[20%] bg-yellow-200/60 blur-[1px]"
            style={{ transform: `rotate(${rotate - 18}deg)` }}
          />

          {/* Subtle energy glow */}
          <div
            className="absolute inset-0 opacity-50 blur-md"
            style={{
              clipPath:
                "polygon(0% 62%, 10% 38%, 22% 0%, 70% 8%, 100% 48%, 82% 100%, 24% 86%)",
              background:
                "linear-gradient(135deg, rgba(250,204,21,0.14), transparent 70%)",
              transform: `rotate(${rotate}deg)`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  // 2. Tối ưu hóa mảng bụi (Dust Particles) chỉ khởi tạo Duy nhất 1 lần khi mount trang
  const dustParticles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      startX: `${Math.random() * 100}%`,
      startY: `${Math.random() * 100}%`,
      endY: `${Math.random() * 100 - 10}%`,
      duration: 5 + Math.random() * 8,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505]">
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.04),transparent_45%)]" />

      {/* Large ambient glow */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[1400px] w-[1400px] rounded-full opacity-30 blur-3xl will-change-transform"
        style={{
          background: `conic-gradient(from 0deg, transparent, oklch(0.852 0.199 91.936 / 0.16), transparent, transparent)`,
        }}
      />

      {/* Orbit rings */}
      <div className="absolute h-[700px] w-[700px] rounded-full border border-yellow-500/10 pointer-events-none" />
      <div className="absolute h-[1100px] w-[1100px] rounded-full border border-yellow-400/5 pointer-events-none" />
      <div className="absolute h-[1500px] w-[1500px] rounded-full border border-zinc-400/5 pointer-events-none" />

      {/* Floating metal shards */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {metalShards.map((shard) => (
          <MetalShard key={shard.id} {...shard} />
        ))}
      </div>

      {/* Optimized Dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {dustParticles.map((dust) => (
          <motion.div
            key={dust.id}
            className="absolute rounded-full bg-white/40 will-change-transform"
            style={{
              width: dust.width,
              height: dust.height,
            }}
            initial={{
              x: dust.startX,
              y: dust.startY,
              opacity: 0,
            }}
            animate={{
              y: [dust.startY, dust.endY],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: dust.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dust.delay,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_45%,rgba(0,0,0,0.85)_100%)]" />

      {/* Content */}
      <div className="relative z-10 w-full px-6">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
