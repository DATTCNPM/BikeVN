import Logo from "@/assets/icons/Logo_yellow.svg";
import { Bell, Home, MessageCircle, CircleUserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/useAuthStore";

export default function Header() {
  const { userProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <header className="h-16 flex justify-between items-center bg-background border-b fixed top-0 left-0 right-0 z-50 px-8">
      <Link to="/home" className="flex items-center gap-2">
        <img src={Logo} alt="Logo" className="w-10" />
        <span className="text-2xl text-primary font-bold">BikeVN</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link
          to="/home"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link
          to="/chat"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
        >
          <MessageCircle className="w-4 h-4" /> Chat
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="p-2 rounded-full">
          <Bell className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <CircleUserRound className="w-4 h-4" />
              <span className="ml-2">{userProfile?.name || "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link to="/profile/info">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/profile/settings">Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Danger Zone</DropdownMenuLabel>
              <DropdownMenuItem
                variant="destructive"
                onClick={async () => {
                  const isSuccess = await logout();
                  if (isSuccess) {
                    navigate("/login");
                  } else {
                    toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
                  }
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
