import { Mail, MapPin, Phone, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InfoPage() {
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
              <h2 className="text-xl font-bold">Admin System</h2>

              <p className="text-muted-foreground">
                administrator@motorent.com
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Họ tên</Label>

              <Input defaultValue="Admin System" className="h-11 rounded-2xl" />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <div className="relative">
                <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  defaultValue="administrator@motorent.com"
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Số điện thoại</Label>

              <div className="relative">
                <Phone className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  defaultValue="0901234567"
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Địa chỉ</Label>

              <div className="relative">
                <MapPin className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  defaultValue="Cà Mau, Việt Nam"
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
