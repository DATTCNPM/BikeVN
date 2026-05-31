import { Mail, Phone, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

import { useAdminAuth } from "@/features/auth/useAdminAuth";

export default function InfoPage() {
  const { adminProfile } = useAdminAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý thông tin tài khoản admin.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <div className="mb-8 flex flex-col items-center gap-4 md:flex-row">
            <Avatar className="size-24">
              <AvatarFallback>
                <User className="size-10" />
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-bold">
                {adminProfile?.name || "Admin System"}
              </h2>

              <p className="text-muted-foreground">
                {adminProfile?.email || "administrator@motorent.com"}
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Họ tên</Label>

              <Input
                defaultValue={adminProfile?.name || "Admin System"}
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <div className="relative">
                <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  defaultValue={
                    adminProfile?.email || "administrator@motorent.com"
                  }
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Số điện thoại</Label>

              <div className="relative">
                <Phone className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  defaultValue={adminProfile?.phone || "0901234567"}
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>
          </div>

          <Button className="mt-6 h-11 rounded-2xl">Lưu thông tin</Button>
        </CardContent>
      </Card>
    </div>
  );
}
