import Logo from "@/assets/icons/Logo_yellow.svg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="h-16 flex justify-between items-center bg-background border-b fixed top-0 left-0 right-0 z-50 px-4">
      <Link to="/" className="flex items-center gap-2">
        <img src={Logo} alt="Logo" className="w-10" />
        <span className="text-2xl font-bold">BikeVN</span>
      </Link>
      <nav className="flex items-center gap-8">
        <div className="flex gap-8 items-center justify-center">
          <Link
            to="/home"
            className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
          >
            Home
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">Đăng nhập</Link>
          </Button>
          <Button size="lg" asChild>
            <Link to="/register">Đăng ký</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
