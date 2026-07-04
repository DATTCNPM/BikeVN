import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wrench, Home } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import ErrorPageLayout from "@/components/layouts/ErrorPageLayout";
import MovingEmoji from "@/components/common/MovingEmoji";

import { useServerRecovery } from "@/features/auth/useServerRecovery";
import { useAuthStore } from "@/features/auth/authStore";
import { useCanvasBackground } from "@/hooks/useCanvasBackground";

const COUNTDOWN_TIME = 15;

export default function ServerErrorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME);

  // Kích hoạt vòng lặp ping hồi sinh 3s/lần
  useServerRecovery();
  const isServerDown = useAuthStore((state) => state.isServerDown);

  // Tự động điều hướng về khi Interceptor hoặc Recovery báo Server đã online
  useEffect(() => {
    if (!isServerDown) {
      navigate("/", { replace: true });
    }
  }, [isServerDown, navigate]);

  const handleGetColors = useCallback(
    (
      isDark: boolean,
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
    ) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDark) {
        gradient.addColorStop(0, "#0c0a09");
        gradient.addColorStop(1, "#1c1917");
      } else {
        gradient.addColorStop(0, "#fffbeb");
        gradient.addColorStop(1, "#fef3c7");
      }
      return {
        background: gradient,
        particleRawColor: isDark ? "239, 68, 68" : "220, 38, 38",
      };
    },
    [],
  );

  useCanvasBackground(canvasRef, {
    particleCount: 40,
    baseRadius: 1.5,
    speedRange: [0.05, 0.25],
    direction: "down",
    getColors: handleGetColors,
  });

  // Đếm ngược UI thuần túy để tạo trải nghiệm động cho người dùng
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? COUNTDOWN_TIME : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progressPercentage = useMemo(() => {
    return ((COUNTDOWN_TIME - timeLeft) / COUNTDOWN_TIME) * 100;
  }, [timeLeft]);

  return (
    <ErrorPageLayout
      canvas={<canvas ref={canvasRef} className="absolute inset-0" />}
      glowClassName="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/10 blur-3xl"
      code="500"
      title="Garage Under Emergency Maintenance"
      description="The MotoRent infrastructure servers are experiencing minor technical hitches. Our engineering crew is already on-site fine-tuning the mechanics to rev your rides back to life."
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
              <span>Waiting for system recovery...</span>
              <span className="font-mono font-bold text-destructive">
                {timeLeft} Seconds
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-destructive transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
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
            Back to Home
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
