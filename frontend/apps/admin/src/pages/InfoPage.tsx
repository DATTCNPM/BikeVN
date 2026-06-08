import { Mail, Phone, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

import { useAdminProfile } from "@/features/auth/useAdminProfile";

export default function InfoPage() {
  const { data: adminProfile, isLoading } = useAdminProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const initials =
    adminProfile?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AD";

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
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-bold">{adminProfile?.name}</h2>

              <p className="text-muted-foreground">{adminProfile?.email}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Họ tên</Label>

              <div className="relative">
                <User className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={adminProfile?.name ?? ""}
                  readOnly
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <div className="relative">
                <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={adminProfile?.email ?? ""}
                  readOnly
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Số điện thoại</Label>

              <div className="relative">
                <Phone className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={adminProfile?.phone ?? ""}
                  readOnly
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>
          </div>

          <Button disabled className="mt-6 h-11 rounded-2xl">
            Chỉnh sửa hồ sơ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
