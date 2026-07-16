import { useState } from "react";
import Logo from "@repo/ui/components/wrapper/Logo";
import {
  Home,
  MessageCircle,
  CircleUserRound,
  CalendarDays,
  LogIn,
} from "lucide-react";
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
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useLogout } from "@/features/auth/hooks/useLogout";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";

export default function Header() {
  const { data: userProfile } = useProfile();
  const { mutateAsync: logout } = useLogout();
  const [openLogout, setOpenLogout] = useState(false);

  return (
    <header className="h-16 w-full fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-[1680px] h-full mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <Link
          to="/home"
          className="group flex items-center gap-2.5 active:scale-95 transition-transform select-none"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-950 text-amber-400 p-1.5 shadow-sm border border-neutral-800 transition-all duration-300 group-hover:scale-105 group-hover:border-neutral-700">
            <Logo className="size-full" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent transition-colors group-hover:text-foreground">
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

          {userProfile && (
            <>
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

              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`
                }
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">My Bookings</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Action Widgets */}
        <div className="flex items-center gap-4">
          {userProfile ? (
            <>
              {/* Chỉ hiện Widget Thông báo khi đã có userProfile */}
              <NotificationPopover />

              {/* Chỉ hiện Menu Profile khi đã có userProfile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full pl-2 pr-4 h-9 border border-border/60 hover:bg-secondary flex items-center gap-2 select-none"
                  >
                    <CircleUserRound className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground max-w-[80px] truncate">
                      {userProfile.name}
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
                      onClick={() => setOpenLogout(true)}
                      className="rounded-lg py-2 focus:bg-destructive/10 focus:text-destructive font-medium cursor-pointer"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* THAY THẾ: Hiển thị nút Đăng nhập nếu chưa có userProfile */
            <Button
              asChild
              variant="default"
              className="rounded-full h-9 px-4 text-xs font-semibold shadow-sm bg-neutral-950 text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Link to="/login">
                <LogIn className="size-3.5" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
      <UniversalDialog
        type="confirm"
        variant="destructive"
        submitLabel="Logout"
        trigger={null}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        onSubmit={() => logout()}
        open={openLogout}
        onOpenChange={setOpenLogout}
      />
    </header>
  );
}
