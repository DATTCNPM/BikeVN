import { LogOut } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { Spinner } from "@repo/ui/components/ui/spinner";

// Hooks
import { useProfile } from "@/features/profile/useProfile";
import { useLogout } from "@/features/auth/useLogout";
import AccountSettings from "@/features/profile/components/AccountSettingSection";

export default function ProfilePage() {
  const { data: user, isLoading: profileLoading } = useProfile();
  const { mutate: logout } = useLogout();

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-6">
        {/* Profile Identity Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-muted/30 border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
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

        {/* Shadcn UI Tabs System */}
        <AccountSettings user={user} />
      </main>
    </div>
  );
}
