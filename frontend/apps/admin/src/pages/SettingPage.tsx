import { useEffect, useState } from "react";
import { Bell, Globe, MoonStar, Palette } from "lucide-react";
import { useTheme } from "next-themes"; // Import hook useTheme từ next-themes

import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Switch } from "@repo/ui/components/ui/switch";

export default function SettingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Tránh lỗi bất đồng bộ Hydration giữa Server và Client khi render state của Theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === "dark";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the interface and system options.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <Palette className="size-5 text-primary" />
            <h2 className="font-semibold">Interface</h2>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={(val) => setTheme(val)}>
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div className="flex items-center gap-3">
              <MoonStar className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Dark mode</p>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode.
                </p>
              </div>
            </div>
            {/* Đồng bộ Switch với trạng thái dark mode hiện tại */}
            <Switch
              checked={isDarkMode}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <Bell className="size-5 text-primary" />
            <h2 className="font-semibold">Notifications</h2>
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div>
              <p className="font-medium">Email notification</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div>
              <p className="font-medium">Push notification</p>
              <p className="text-sm text-muted-foreground">
                Receive system notifications.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <Globe className="size-5 text-primary" />
            <h2 className="font-semibold">Language</h2>
          </div>

          <Select defaultValue="en">
            <SelectTrigger className="h-11 rounded-2xl">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <Button className="h-11 rounded-2xl">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
