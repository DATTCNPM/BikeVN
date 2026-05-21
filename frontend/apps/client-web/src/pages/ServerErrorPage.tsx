import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wrench, RefreshCw, Home } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { useAuthStore } from "@/features/auth/authStore";

import { usePingServer } from "@/features/auth/authHook";

const COUNTDOWN_TIME = 15; // Thời gian chờ tự động kiểm tra lại (giây)

export default function ServerErrorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  usePingServer();

  // Lấy trạng thái isServerDown và hàm ping hệ thống từ store của bạn
  const { isServerDown, ping } = useAuthStore() as any;
  console.log("isServerDown:", isServerDown);

  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME);

  // 1. Hiệu ứng Canvas Background: Gara đang bảo trì (Hạt rơi và tia điện nhỏ)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.2 + 0.05,
      opacity: Math.random() * 0.4,
    }));

    let animationFrame: number;
    const isDarkMode = () =>
      document.documentElement.classList.contains("dark");

    const render = () => {
      const dark = isDarkMode();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (dark) {
        gradient.addColorStop(0, "#0c0a09");
        gradient.addColorStop(1, "#1c1917");
      } else {
        gradient.addColorStop(0, "#fffbeb");
        gradient.addColorStop(1, "#fef3c7");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Raining Smoke Particles
      particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(239, 68, 68, ${p.opacity})` // Đỏ nhạt hệ thống lỗi (Dark mode)
          : `rgba(220, 38, 38, ${p.opacity})`; // Light mode
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // 2. Cơ chế Tự động kiểm tra hệ thống (Auto-retry & Redirect)
  useEffect(() => {
    // Nếu server không down nữa (ví dụ bấm Thử lại thành công), chuyển ngay về trang chủ
    if (!isServerDown) {
      navigate("/");
      return;
    }

    const timer = setInterval(async () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Khi đếm ngược về 0, tự động ping kiểm tra lại backend
          handleRetry();
          return COUNTDOWN_TIME; // Reset bộ đếm
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isServerDown, navigate]);

  const handleRetry = async () => {
    if (ping) {
      await ping(); // Gọi hàm ping trong store để cập nhật trạng thái isServerDown mới nhất
    }
  };

  // Tính toán phần trăm thanh progress bar
  const progressPercentage =
    ((COUNTDOWN_TIME - timeLeft) / COUNTDOWN_TIME) * 100;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-500">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Blur Glow sắc đỏ/cam cảnh báo */}
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/10 blur-3xl" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center"
      >
        {/* Mã lỗi 500 */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-b from-destructive via-orange-500 to-destructive/30 bg-clip-text text-[120px] leading-none font-black tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.2)] md:text-[180px]"
        >
          500
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-3xl font-bold tracking-tight md:text-5xl"
        >
          Gara đang bảo trì đột xuất
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg"
        >
          Hệ thống máy chủ BikeVN hiện đang gặp sự cố kỹ thuật nhỏ. Đội ngũ kỹ
          sư của chúng tôi đang nhanh chóng sửa chữa và hồi sức cho "chiến mã"
          của bạn.
        </motion.p>

        {/* ── Progress Bar hiển thị thời gian chờ đợi ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 w-full max-w-xs"
        >
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Tự động kiểm tra lại sau...</span>
            <span className="font-mono font-bold text-destructive">
              {timeLeft} Giây
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-destructive transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* Đồ họa Đội Sửa Xe chạy qua chạy lại (Tương tự hiệu ứng Moto file mẫu) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "220px" }}
          transition={{ delay: 0.6, duration: 1 }}
          className="relative mt-8 h-[2px] bg-gradient-to-r from-transparent via-destructive to-transparent"
        >
          <motion.div
            animate={{ x: [0, 180, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 text-xl"
          >
            🛠️
          </motion.div>
        </motion.div>

        {/* Hành động */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button
            onClick={handleRetry}
            size="lg"
            className="h-12 rounded-2xl px-6 text-base shadow-lg shadow-destructive/20 bg-destructive hover:bg-destructive/90"
          >
            <RefreshCw className="mr-2 size-4 animate-spin-slow" />
            Thử kết nối lại ngay
          </Button>

          <Button
            onClick={() => navigate("/")}
            size="lg"
            variant="secondary"
            className="h-12 rounded-2xl px-6 text-base"
          >
            <Home className="mr-2 size-4" />
            Về Trang Chủ (Landing)
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Wrench className="size-4 animate-pulse text-destructive" />
          <span>MotoRent Premium Maintenance Experience</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
