import { Bell, Globe, MoonStar, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function SettingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý giao diện và tùy chọn hệ thống.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <Palette className="size-5 text-primary" />

            <h2 className="font-semibold">Giao diện</h2>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>

            <Select>
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue placeholder="Chọn theme" />
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
                  Bật giao diện tối.
                </p>
              </div>
            </div>

            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <Bell className="size-5 text-primary" />

            <h2 className="font-semibold">Thông báo</h2>
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div>
              <p className="font-medium">Email notification</p>

              <p className="text-sm text-muted-foreground">
                Nhận thông báo qua email.
              </p>
            </div>

            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div>
              <p className="font-medium">Push notification</p>

              <p className="text-sm text-muted-foreground">
                Nhận thông báo hệ thống.
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

            <h2 className="font-semibold">Ngôn ngữ</h2>
          </div>

          <Select>
            <SelectTrigger className="h-11 rounded-2xl">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>

            <SelectContent className="rounded-2xl">
              <SelectItem value="vi">Tiếng Việt</SelectItem>

              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <Button className="h-11 rounded-2xl">Lưu thay đổi</Button>
        </CardContent>
      </Card>
    </div>
  );
}
