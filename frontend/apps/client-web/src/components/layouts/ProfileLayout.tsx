import { Outlet, NavLink } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  CalendarDays,
  Home,
  MessageCircle,
  Bell,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useProfile } from "@/features/profile/useProfile";
import { useLogout } from "@/features/auth/useLogout";
import Logo from "@/assets/icons/Logo_yellow.svg";
import { Link } from "react-router-dom";

export default function ProfileLayout() {
  const { data: userProfile, isLoading: profileLoading } = useProfile();
  const { mutate: logout } = useLogout();

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Định nghĩa các Tabs điều hướng tương ứng với các sub-routes của bạn
  const profileTabs = [
    {
      path: "/profile/info",
      label: "Personal Information",
      icon: User,
    },
    {
      path: "/profile/bookings",
      label: "Manage Bookings",
      icon: CalendarDays,
    },
    {
      path: "/profile/settings",
      label: "System Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Global Header */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <Link to="/home" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-10" />
          <span className="text-2xl text-primary font-bold">BikeVN</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/home"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-sm font-medium"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            to="/chat"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" /> Chat
          </Link>
          <Button variant="outline" className="p-2 rounded-full">
            <Bell className="w-4 h-4" />
          </Button>
        </nav>
      </header>

      {/* Main Profile Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 lg:p-10 space-y-8">
        {/* Profile User Identity Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-muted/30 border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {userProfile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">
                {userProfile?.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {userProfile?.email}
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => logout()}
            className="self-start sm:self-center gap-2 rounded-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-b border-border flex gap-2 overflow-x-auto scrollbar-none">
          {profileTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap -mb-[2px] ${
                    isActive
                      ? "border-primary text-primary bg-primary/5 rounded-t-xl font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/20"
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Dynamic Content Section */}
        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
