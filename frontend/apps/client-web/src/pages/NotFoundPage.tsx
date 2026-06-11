import { useEffect, useRef } from "react";

import { motion } from "framer-motion";

import { Compass } from "lucide-react";

import ErrorPageLayout from "@/components/layouts/ErrorPageLayout";
import MovingEmoji from "@/components/common/MovingEmoji";

export default function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const particles = Array.from({
      length: 80,
    }).map(() => ({
      x: Math.random() * canvas.width,

      y: Math.random() * canvas.height,

      radius: Math.random() * 2 + 0.5,

      speed: Math.random() * 0.4 + 0.1,

      opacity: Math.random() * 0.5,
    }));

    let animationFrame: number;

    const isDarkMode = () =>
      document.documentElement.classList.contains("dark");

    const render = () => {
      const dark = isDarkMode();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

      if (dark) {
        gradient.addColorStop(0, "#09090b");

        gradient.addColorStop(1, "#18181b");
      } else {
        gradient.addColorStop(0, "#fafaf9");

        gradient.addColorStop(1, "#f5f5f4");
      }

      ctx.fillStyle = gradient;

      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles
      particles.forEach((particle) => {
        particle.y -= particle.speed;

        if (particle.y < 0) {
          particle.y = canvas.height;
        }

        ctx.beginPath();

        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        ctx.fillStyle = dark
          ? `rgba(251,191,36,${particle.opacity})`
          : `rgba(217,119,6,${particle.opacity})`;

        ctx.fill();
      });

      // Road line
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

      ctx.strokeStyle = dark ? "rgba(251,191,36,0.15)" : "rgba(217,119,6,0.12)";

      ctx.lineWidth = 4;

      ctx.stroke();

      // Glow circle
      ctx.beginPath();

      ctx.arc(canvas.width * 0.5, canvas.height * 0.3, 120, 0, Math.PI * 2);

      ctx.fillStyle = dark ? "rgba(251,191,36,0.05)" : "rgba(217,119,6,0.04)";

      ctx.fill();

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <ErrorPageLayout
      canvas={<canvas ref={canvasRef} className="absolute inset-0" />}
      glowClassName="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
      code="404"
      title="Lạc đường giữa hành trình"
      description="Có vẻ tuyến đường bạn tìm kiếm không tồn tại hoặc đã được thay đổi. Hãy quay lại gara và tiếp tục hành trình với chiếc xe phù hợp hơn."
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
          {/* giữ nguyên button */}
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
