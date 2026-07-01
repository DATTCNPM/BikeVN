import { type ReactNode, useEffect, useRef } from "react";

type AuthBackgroundProps = {
  children: ReactNode;
};

export default function AuthBackground({ children }: AuthBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Cấu hình hệ thống hạt giả lập bụi vũ trụ và vệt sáng kim loại nhẹ
    const particleCount = Math.min(60, Math.floor((width * height) / 30000)); // Tự thích ứng màn hình
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;
      color: string;
    }> = [];

    const colors = [
      "rgba(255, 255, 255, ",
      "rgba(250, 204, 21, ", // Ánh vàng Neon nhẹ matching thương hiệu
      "rgba(161, 161, 170, ", // Màu kim loại Titan
    ];

    // Khởi tạo cụm hạt
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.5 - 0.1, // Luôn bay nhẹ lên trên
        opacity: Math.random() * 0.6 + 0.2,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Vòng lặp vẽ đồ họa bằng Canvas (Tối ưu phần cứng tuyệt đối)
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i]!;

        // Cập nhật vị trí
        p.x += p.speedX;
        p.y += p.speedY;

        // Xử lý khi hạt bay ra khỏi màn hình
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.speedX *= -1;
        }

        // Vẽ hạt dạng bụi mịn quý phái
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Xử lý co giãn trình duyệt
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505]">
      {/* Canvas chạy ngầm siêu mượt - Thay thế 60 DOM Nodes cũ */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* Cosmic background / Ambient Glow (Giữ lại các lớp layer tĩnh, không chuyển động) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.02),transparent_50%)]" />

      {/* Vòng tròn quỹ đạo tĩnh nghệ thuật (Không quay bằng JS -> Cực nhẹ) */}
      <div className="absolute h-[700px] w-[700px] rounded-full border border-yellow-500/5 pointer-events-none" />
      <div className="absolute h-[1100px] w-[1100px] rounded-full border border-zinc-400/5 pointer-events-none" />

      {/* Lớp phủ điện ảnh Vignette đậm chất Dark Mode */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_45%,rgba(0,0,0,0.9)_100%)]" />

      {/* Khung nội dung Form Đăng nhập/Đăng ký */}
      <div className="relative z-10 w-full px-6">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
