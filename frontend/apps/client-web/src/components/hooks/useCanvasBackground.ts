import { useEffect, type RefObject } from "react";

interface CanvasConfig {
  particleCount?: number;
  baseRadius?: number;
  speedRange?: [number, number];
  direction?: "up" | "down";
  // Màu sắc dạng callback hoặc object tùy theo chế độ dark mode
  getColors: (
    isDark: boolean,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    background: CanvasGradient | string;
    particle: string;
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
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Tách biệt logic kiểm tra Dark Mode (Chỉ chạy 1 lần lúc cấu hình hoặc khi resize, không truy vấn DOM mỗi frame)
    let isDark = document.documentElement.classList.contains("dark");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isDark = document.documentElement.classList.contains("dark");
    };

    resize();
    window.addEventListener("resize", resize);

    // 2. Khởi tạo danh sách các hạt (Particles)
    const count = config.particleCount ?? 50;
    const [minSpeed, maxSpeed] = config.speedRange ?? [0.1, 0.5];
    const baseRadius = config.baseRadius ?? 1;

    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * baseRadius + 0.5,
      speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let animationFrameId: number;

    // 3. Hàm render chính của Canvas Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lấy bảng màu từ config truyền vào
      const colors = config.getColors(isDark, ctx, canvas);

      // Vẽ Background
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Vẽ Particles
      particles.forEach((particle) => {
        // Hướng di chuyển
        if (config.direction === "down") {
          particle.y += particle.speed;
          if (particle.y > canvas.height) particle.y = 0;
        } else {
          particle.y -= particle.speed;
          if (particle.y < 0) particle.y = canvas.height;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        // Thay thế chuỗi string hạt bằng cách inject độ mờ (opacity) vào màu cấu hình
        ctx.fillStyle = colors.particle.replace(
          "OPACITY",
          particle.opacity.toString(),
        );
        ctx.fill();
      });

      // Vẽ thêm các họa tiết riêng biệt (nếu có)
      if (config.drawExtra) {
        config.drawExtra(ctx, canvas, isDark);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, config]);
};
