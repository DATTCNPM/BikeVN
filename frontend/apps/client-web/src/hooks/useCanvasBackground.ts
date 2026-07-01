import { useEffect, type RefObject } from "react";

interface CanvasConfig {
  particleCount?: number;
  baseRadius?: number;
  speedRange?: [number, number];
  direction?: "up" | "down";
  getColors: (
    isDark: boolean,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    background: CanvasGradient | string;
    particleRawColor: string; // Expected format: "r, g, b" (e.g., "251, 191, 36")
  };
  drawExtra?: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    isDark: boolean,
  ) => void;
}

export const useCanvasBackground = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  config: CanvasConfig,
) => {
  // Destructure config properties to avoid dependency loop issues with object references
  const {
    particleCount = 50,
    baseRadius = 1,
    speedRange = [0.1, 0.5],
    direction = "up",
    getColors,
    drawExtra,
  } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDark = document.documentElement.classList.contains("dark");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isDark = document.documentElement.classList.contains("dark");
    };

    resize();
    window.addEventListener("resize", resize);

    const [minSpeed, maxSpeed] = speedRange;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * baseRadius + 0.5,
      speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const colors = getColors(isDark, ctx, canvas);

      // Render Background Gradient/Color
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Moving Particles
      particles.forEach((particle) => {
        if (direction === "down") {
          particle.y += particle.speed;
          if (particle.y > canvas.height) particle.y = 0;
        } else {
          particle.y -= particle.speed;
          if (particle.y < 0) particle.y = canvas.height;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors.particleRawColor}, ${particle.opacity})`;
        ctx.fill();
      });

      // Render custom page decorations if specified
      if (drawExtra) {
        drawExtra(ctx, canvas, isDark);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [
    canvasRef,
    particleCount,
    baseRadius,
    speedRange,
    direction,
    getColors,
    drawExtra,
  ]);
};
