import { Link } from "react-router-dom";
import { support, social, contact } from "@/constants/FooterConstant";
import LogoYellow from "@/assets/icons/Logo_yellow.svg";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-transparent">
      <div className="container mx-auto grid gap-12 px-8 py-12 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={LogoYellow} alt="BikeVN Logo" className="h-10" />
            <h2 className="text-xl font-bold text-foreground">BikeVN</h2>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            BikeVN is your trusted companion for buying and selling motorcycles
            in Vietnam. We provide a seamless platform for motorcycle
            enthusiasts to connect, explore, and find their perfect ride.
          </p>
          {/* Social */}
          <div className="flex items-center gap-4 mt-8">
            {social.map((item) => (
              <button
                key={item}
                className="w-12 h-12 rounded-2xl border border-primary text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-white/20 transition-all duration-300"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Explore
          </h3>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/home" className="transition-colors hover:text-primary">
              Home
            </Link>

            <Link to="/chat" className="transition-colors hover:text-primary">
              Chat
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Support
          </h3>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {support.map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors hover:text-primary"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Contact
          </h3>

          <div className="space-y-3 text-sm text-muted-foreground">
            {contact.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {item.icon}
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-8 py-4 text-sm text-muted-foreground md:flex-row">
          <p>© 2026 BikeVN. All rights reserved.</p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#"
              className="hover:text-primary transition-colors duration-300"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className=" hover:text-primary transition-colors duration-300"
            >
              Terms of Service
            </a>

            <a
              href="#"
              className="hover:text-primary transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
