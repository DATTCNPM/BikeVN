import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wrench, Home } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";

import ErrorPageLayout from "@/components/layouts/ErrorPageLayout";
import MovingEmoji from "@/components/common/MovingEmoji";

import { useServerRecovery } from "@/features/auth/useServerRecovery";
import { useAuthStore } from "@/features/auth/authStore";

const COUNTDOWN_TIME = 15;

export default function ServerErrorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  useServerRecovery();
  const isServerDown = useAuthStore((state) => state.isServerDown);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME);

  useEffect(() => {
    if (!isServerDown) {
      navigate("/");
    }
  }, [isServerDown, navigate]);
  /**
   * Canvas background
   */
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

      particles.forEach((particle) => {
        particle.y += particle.speed;

        if (particle.y > canvas.height) {
          particle.y = 0;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        ctx.fillStyle = dark
          ? `rgba(239,68,68,${particle.opacity})`
          : `rgba(220,38,38,${particle.opacity})`;

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

  /**
   * Countdown UI
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return COUNTDOWN_TIME;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progressPercentage =
    ((COUNTDOWN_TIME - timeLeft) / COUNTDOWN_TIME) * 100;

  return (
    <ErrorPageLayout
      canvas={<canvas ref={canvasRef} className="absolute inset-0" />}
      glowClassName="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/10 blur-3xl"
      code="500"
      title="Gara đang bảo trì đột xuất"
      description='Hệ thống máy chủ BikeVN hiện đang gặp sự cố kỹ thuật nhỏ. Đội ngũ kỹ sư của chúng tôi đang nhanh chóng sửa chữa và hồi sức cho "chiến mã" của bạn.'
      codeClassName="bg-gradient-to-b from-destructive via-orange-500 to-destructive/30 bg-clip-text text-[120px] leading-none font-black tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.2)] md:text-[180px]"
      middleContent={
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 w-full max-w-xs"
          >
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Đang chờ hệ thống khôi phục...</span>

              <span className="font-mono font-bold text-destructive">
                {timeLeft} Giây
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-destructive transition-all duration-1000 ease-linear"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </motion.div>

          <MovingEmoji
            emoji="🛠️"
            duration={5}
            gradientClassName="bg-gradient-to-r from-transparent via-destructive to-transparent"
          />
        </>
      }
      actions={
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            variant="secondary"
            className="h-12 rounded-2xl px-6 text-base"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 size-4" />
            Về Trang Chủ
          </Button>
        </motion.div>
      }
      footer={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Wrench className="size-4 animate-pulse text-destructive" />
          <span>MotoRent Premium Maintenance Experience</span>
        </motion.div>
      }
    />
  );
}
