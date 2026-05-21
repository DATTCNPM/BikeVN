import { Button } from "@repo/ui/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Vehicle from "@/components/landing/Vehicle";
import Hero from "@/components/landing/Hero";
import CTA from "@/components/landing/CTA";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import LogoYellow from "@/assets/icons/Logo_yellow.svg";
import LogoWhite from "@/assets/icons/Logo_white.svg";
import {
  support,
  contact,
  navigation,
  social,
} from "@/constants/FooterConstant";
import { useAuthStore } from "@/features/auth/authStore";

export default function Landing() {
  const isLogin = useAuthStore((state) => state.isLogin);
  console.log("isLogin:", isLogin);
  const navigate = useNavigate();

  if (isLogin) {
    navigate("/home");
  }

  return (
    <div className="relative bg-[#050505] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.03] blur-[160px] rounded-full" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <header className=" fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm h-16 flex items-center justify-center gap-24">
        <Link to="/" className="flex items-center gap-2">
          <img src={LogoYellow} alt="BikeVN Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-primary">BikeVN</h1>
        </Link>

        <nav>
          <ul className="flex items-center space-x-6 text-white/80">
            <Button variant="link" size="lg" asChild>
              <a href="/">Trang chủ</a>
            </Button>
            <li>
              <a href="#features" className="hover:underline">
                Dịch vụ
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:underline">
                Hướng dẫn
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">Đăng nhập</Link>
          </Button>
          <Button size="lg" asChild>
            <Link to="/register">Đăng ký</Link>
          </Button>
        </div>
      </header>
      {/* Hero Section */}
      <Hero />

      <div className="relative z-10 container mx-auto px-10 pt-32 space-y-32">
        {/* ================= FEATURES ================= */}
        <Features />
        {/* ================= HOW IT WORKS ================= */}
        <HowItWorks />
        {/* CTA Section */}
        <CTA />
        {/* Sample Vehicles */}
        <Vehicle />
      </div>
      <footer className="relative z-10 container px-6 mt-32">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <img src={LogoWhite} alt="BikeVN Logo" className="h-10" />

              <h2 className="text-2xl font-bold text-secondary">BikeVN</h2>
            </div>

            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
              Nền tảng thuê xe hiện đại giúp bạn dễ dàng tìm kiếm, đặt xe và
              trải nghiệm hành trình một cách nhanh chóng, an toàn và tiện lợi.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 mt-8">
              {social.map((item) => (
                <button
                  key={item}
                  className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06] hover:text-muted hover:border-white/20 transition-all duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Điều hướng</h3>

            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="
                  text-muted-foreground
                  hover:text-primary
                  transition-colors duration-300
                "
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm  font-semibold">Hỗ trợ</h3>

            <ul className="space-y-4">
              {support.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="
                  text-white/80
                  hover:text-primary
                  transition-colors duration-300
                "
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-secondary font-semibold">Liên hệ</h3>

            <div className="space-y-5 text-white/80">
              {contact.map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  {item.icon}
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
          <p className="text-white/80 text-sm text-center md:text-left">
            © 2026 BikeVN. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-white/80">
            <a
              href="#"
              className="hover:text-muted transition-colors duration-300"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className=" hover:text-muted transition-colors duration-300"
            >
              Terms of Service
            </a>

            <a
              href="#"
              className="hover:text-muted transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
