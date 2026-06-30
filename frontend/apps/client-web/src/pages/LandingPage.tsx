import { Button } from "@repo/ui/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/authStore";

import Vehicle from "@/features/landing/Vehicle";
import Hero from "@/features/landing/Hero";
import CTA from "@/features/landing/CTA";
import HowItWorks from "@/features/landing/HowItWorks";
import Features from "@/features/landing/Features";

import LogoYellow from "@/assets/icons/Logo_yellow.svg";
import LogoWhite from "@/assets/icons/Logo_white.svg";
import {
  support,
  contact,
  navigation,
  social,
} from "@/constants/FooterConstant";

export default function Landing() {
  const isLogin = useAuthStore((state) => state.isLogin);
  console.log("isLogin:", isLogin);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate("/home");
    }
  }, [isLogin, navigate]);

  // CSS đồng bộ cho các link trên Header
  const navLinkStyle =
    "text-sm font-medium text-white/80 hover:text-primary transition-colors duration-200";

  return (
    <div className="relative bg-[#050505] overflow-hidden min-h-screen text-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.03] blur-[160px] rounded-full pointer-events-none" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      {/* ================= HEADER (Optimized Layout) ================= */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/60 backdrop-blur-md h-16 border-b border-white/5">
        <div className="container mx-auto h-full px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={LogoYellow}
              alt="BikeVN Logo"
              className="h-9 group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold tracking-tight text-primary">
              BikeVN
            </span>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li>
                <Link to="/" className={navLinkStyle}>
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className={navLinkStyle}>
                  Services
                </a>
              </li>
              <li>
                <a href="#how-it-works" className={navLinkStyle}>
                  How It Works
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-white/80 hover:text-primary transition-colors duration-200">
              <Link to="/login">Login</Link>
            </button>
            <Button size="lg" className="rounded-xl" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Main Content Layout */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pt-24 space-y-32">
        <Features />
        <HowItWorks />
        <CTA />
        <Vehicle />
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 container mx-auto px-6 md:px-12 mt-32 pb-12">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img src={LogoWhite} alt="BikeVN Logo" className="h-9" />
              <h2 className="text-xl font-bold text-secondary tracking-tight">
                BikeVN
              </h2>
            </div>

            <p className="text-white/60 leading-relaxed max-w-sm text-sm">
              BikeVN is a leading bike rental service, offering a wide range of
              bikes for all your riding needs. Whether you're looking for a
              leisurely ride around the city or an adventurous mountain biking.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {social.map((item, idx) => (
                <button
                  key={`social-${idx}`}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <ul className="space-y-3 text-sm">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <ul className="space-y-3 text-sm">
              {support.map((item, idx) => (
                <li key={`support-${idx}`}>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-secondary">Contact</h3>
            <div className="space-y-4 text-sm text-white/60">
              {contact.map((item, idx) => (
                <div key={`contact-${idx}`} className="flex items-center gap-3">
                  <span className="text-white/80">{item.icon}</span>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 text-xs md:text-sm text-white/40">
          <p>© 2026 BikeVN. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
