import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Hero from "./Hero";
import CTA from "./CTA";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import LogoWhite from "@/assets/icons/Logo_white.svg";
export default function Landing() {
  const services = [
    "Thuê xe theo ngày",
    "Thuê xe dài hạn",
    "Xe cao cấp",
    "Hỗ trợ tài xế",
    "Bảo hiểm xe",
  ];
  const navigation = [
    {
      name: "Trang chủ",
      href: "/",
    },
    {
      name: "Dịch vụ",
      href: "#features",
    },
    {
      name: "Hướng dẫn",
      href: "#how-it-works",
    },
  ];
  const social = ["FB", "IG", "YT", "TW"];
  const contact = [
    {
      type: "Email",
      value: "contact@bikevn.com",
    },
    {
      type: "Hotline",
      value: "+84 123 456 789",
    },
    {
      type: "Địa chỉ",
      value: "123 Đường ABC, Quận 1, TP.HCM",
    },
  ];
  return (
    <div className="relative bg-[#050505] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.03] blur-[160px] rounded-full" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <header className=" fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm h-16 flex items-center justify-center gap-24">
        <div className="flex items-center gap-2">
          <img src={LogoWhite} alt="BikeVN Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-white">BikeVN</h1>
        </div>
        <nav>
          <ul className="flex items-center space-x-6 text-white">
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
      <Hero />

      <div className="relative z-10 container mx-auto px-6 pt-32 space-y-32">
        {/* ================= FEATURES ================= */}
        <Features />
        {/* ================= HOW IT WORKS ================= */}
        <HowItWorks />
        {/* CTA Section */}
        <CTA />
      </div>
      <footer className="relative z-10 container px-6 mt-32">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <img src={LogoWhite} alt="BikeVN Logo" className="h-10" />

              <h2 className="text-2xl font-bold text-white">BikeVN</h2>
            </div>

            <p className="mt-6 text-white/60 leading-relaxed max-w-md">
              Nền tảng thuê xe hiện đại giúp bạn dễ dàng tìm kiếm, đặt xe và
              trải nghiệm hành trình một cách nhanh chóng, an toàn và tiện lợi.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 mt-8">
              {social.map((item) => (
                <button
                  key={item}
                  className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-all duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-6">Điều hướng</h3>

            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="
                  text-white/60
                  hover:text-white
                  transition-colors duration-300
                "
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">Dịch vụ</h3>

            <ul className="space-y-4">
              {services.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="
                  text-white/60
                  hover:text-white
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
          <div>
            <h3 className="text-white font-semibold mb-6">Liên hệ</h3>

            <div className="space-y-5 text-white/60">
              {contact.map((item) => (
                <div key={item.type}>
                  <p className="font-medium text-white">{item.type}:</p>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
          <p className="text-white/40 text-sm text-center md:text-left">
            © 2026 BikeVN. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>

            <a
              href="#"
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
