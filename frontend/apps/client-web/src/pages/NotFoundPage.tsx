import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

import ErrorPageLayout from "@/components/layouts/ErrorPageLayout";
import MovingEmoji from "@/components/common/MovingEmoji";
import { useCanvasBackground } from "@/hooks/useCanvasBackground";

export default function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Memoize canvas drawing calculations using useCallback for premium UI performance
  const handleGetColors = useCallback(
    (
      isDark: boolean,
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
    ) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDark) {
        gradient.addColorStop(0, "#09090b");
        gradient.addColorStop(1, "#18181b");
      } else {
        gradient.addColorStop(0, "#fafaf9");
        gradient.addColorStop(1, "#f5f5f4");
      }
      return {
        background: gradient,
        particleRawColor: isDark ? "251, 191, 36" : "217, 119, 6",
      };
    },
    [],
  );

  const handleDrawExtra = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      isDark: boolean,
    ) => {
      // Elegant background road silhouette curve
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.8);
      ctx.quadraticCurveTo(
        canvas.width * 0.2,
        canvas.height * 0.72,
        canvas.width * 0.45,
        canvas.height * 0.82,
      );
      ctx.quadraticCurveTo(
        canvas.width * 0.75,
        canvas.height * 0.92,
        canvas.width,
        canvas.height * 0.8,
      );
      ctx.strokeStyle = isDark
        ? "rgba(251, 191, 36, 0.15)"
        : "rgba(217, 119, 6, 0.12)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Soft ambient glow overlay circle
      ctx.beginPath();
      ctx.arc(canvas.width * 0.5, canvas.height * 0.3, 120, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? "rgba(251, 191, 36, 0.05)"
        : "rgba(217, 119, 6, 0.04)";
      ctx.fill();
    },
    [],
  );

  useCanvasBackground(canvasRef, {
    particleCount: 80,
    baseRadius: 2,
    speedRange: [0.1, 0.5],
    direction: "up",
    getColors: handleGetColors,
    drawExtra: handleDrawExtra,
  });

  return (
    <ErrorPageLayout
      canvas={<canvas ref={canvasRef} className="absolute inset-0" />}
      glowClassName="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
      code="404"
      title="Lost Along the Journey"
      description="It seems the route you are looking for does not exist or has been relocated. Let's get you back to the garage to find the perfect ride for your adventure."
      showGrid
      codeClassName="bg-gradient-to-b from-primary via-amber-400 to-primary/30 bg-clip-text text-[120px] leading-none font-black tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.25)] md:text-[180px]"
      middleContent={
        <MovingEmoji
          emoji="🏍️"
          gradientClassName="bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      }
      actions={
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          {/* Action buttons live here */}
        </motion.div>
      }
      footer={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Compass className="size-4" />
          <span>MotoRent Premium Experience</span>
        </motion.div>
      }
    />
  );
}
