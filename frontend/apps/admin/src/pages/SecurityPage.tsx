import { KeyRound, ShieldCheck, Smartphone } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Switch } from "@repo/ui/components/ui/switch";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage passwords and account security.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <KeyRound className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">Change Password</h2>

              <p className="text-sm text-muted-foreground">
                Update your account password.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="space-y-2">
              <Label>Current Password</Label>

              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>

              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm New Password</Label>

              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-2xl"
              />
            </div>
          </div>

          <Button className="h-11 rounded-2xl">Update Password</Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">Advanced Security</h2>

              <p className="text-sm text-muted-foreground">
                Activate additional account protection layers.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="size-5 text-muted-foreground" />

              <div>
                <p className="font-medium">Two-Factor Authentication</p>

                <p className="text-sm text-muted-foreground">
                  Protect your account with OTP.
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
