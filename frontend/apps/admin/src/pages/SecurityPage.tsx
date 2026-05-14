import { KeyRound, ShieldCheck, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bảo mật</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý mật khẩu và bảo mật tài khoản.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <KeyRound className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">Đổi mật khẩu</h2>

              <p className="text-sm text-muted-foreground">
                Cập nhật mật khẩu mới cho tài khoản.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="space-y-2">
              <Label>Mật khẩu hiện tại</Label>

              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Mật khẩu mới</Label>

              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Xác nhận mật khẩu</Label>

              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-2xl"
              />
            </div>
          </div>

          <Button className="h-11 rounded-2xl">Cập nhật mật khẩu</Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">Bảo mật nâng cao</h2>

              <p className="text-sm text-muted-foreground">
                Kích hoạt các lớp bảo vệ tài khoản.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="size-5 text-muted-foreground" />

              <div>
                <p className="font-medium">Xác thực 2 bước</p>

                <p className="text-sm text-muted-foreground">
                  Bảo vệ tài khoản bằng OTP.
                </p>
              </div>
            </div>

            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
