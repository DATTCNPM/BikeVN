import { Link } from "react-router-dom";
import LogoYellow from "@/assets/icons/Logo_yellow.svg";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-8">
      <div className="max-w-[1680px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Bản sắc thương hiệu & Bản quyền */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <img
              src={LogoYellow}
              alt="BikeVN Logo"
              className="h-7 w-7 object-contain"
            />
            <span className="text-base font-bold tracking-tight">BikeVN</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 BikeVN. All rights reserved.
          </p>
        </div>

        {/* Liên kết nhanh & Pháp lý rút gọn */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
          <Link
            to="/home"
            className="hover:text-primary transition-colors duration-200"
          >
            Explore
          </Link>
          <Link
            to="/chat"
            className="hover:text-primary transition-colors duration-200"
          >
            Chat
          </Link>
          <a
            href="#"
            className="hover:text-primary transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-primary transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-primary transition-colors duration-200"
          >
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
}
