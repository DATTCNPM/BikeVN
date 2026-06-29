import Logo from "@/assets/icons/Logo_yellow.svg";
import { Home, MessageCircle, CircleUserRound } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
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
import { NotificationPopover } from "@/features/notifications/components/notificationPopover";
import { useProfile } from "@/features/profile/useProfile";
import { useLogout } from "@/features/auth/useLogout";

export default function Header() {
  const { data: userProfile } = useProfile();
  const { mutateAsync: logout } = useLogout();

  return (
    <header className="h-16 w-full fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-[1680px] h-full mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <Link
          to="/home"
          className="flex items-center gap-2.5 active:scale-95 transition-transform"
        >
          <img
            src={Logo}
            alt="BikeVN Logo"
            className="w-9 h-9 object-contain"
          />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            BikeVN
          </span>
        </Link>

        {/* Consumer Global Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`
            }
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`
            }
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </NavLink>
        </nav>

        {/* Action Widgets */}
        <div className="flex items-center gap-4">
          <NotificationPopover />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full pl-2 pr-4 h-9 border border-border/60 hover:bg-secondary flex items-center gap-2"
              >
                <CircleUserRound className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground max-w-[80px] truncate">
                  {userProfile?.name || "User"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 rounded-2xl shadow-xl border border-border/50 animate-in fade-in-50 zoom-in-95 duration-200"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuItem
                  asChild
                  className="rounded-lg focus:bg-secondary py-2 cursor-pointer"
                >
                  <Link to="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => logout()}
                  className="rounded-lg py-2 focus:bg-destructive/10 focus:text-destructive font-medium cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
