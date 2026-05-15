import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  Calendar,
  Edit2,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import UpdateProfile from "@/components/profile/UpdateProfile";
import { useAuthStore } from "@/stores/useAuthStore";

export default function InfoSection() {
  const user = useAuthStore((state) => state.userProfile);
  const infoItems = [
    {
      icon: <User className="text-muted-foreground" />,
      label: "Họ và tên",
      value: user?.name || "Chưa cập nhật",
    },
    {
      icon: <Mail className="text-muted-foreground" />,
      label: "Email liên hệ",
      value: user?.email || "Chưa cập nhật",
    },
    {
      icon: <Phone className="text-muted-foreground" />,
      label: "Số điện thoại",
      value: user?.phone || "Chưa cập nhật",
    },
    {
      icon: <CreditCard className="text-muted-foreground" />,
      label: "Số CCCD",
      value: user?.cccd_number || "Chưa cập nhật",
    },
    {
      icon: <Shield className="text-muted-foreground" />,
      label: "Vai trò hệ thống",
      value: (
        <Badge
          variant={user?.role === "admin" ? "default" : "outline"}
          className="capitalize"
        >
          {user?.role || "Chưa cập nhật"}
        </Badge>
      ),
    },
    {
      icon: <Calendar className="text-muted-foreground" />,
      label: "Ngày tham gia",
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          Hồ sơ cá nhân
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin định danh và liên lạc của bạn.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Chi tiết tài khoản</CardTitle>
          <CardDescription>
            Các thông tin này được sử dụng cho việc xác thực và bảo mật.
          </CardDescription>
          <CardAction>
            <UpdateProfile
              trigger={
                <Button variant="outline">
                  <Edit2 className="w-4 h-4" />
                  <span className="ml-2">Chỉnh sửa</span>
                </Button>
              }
            />
          </CardAction>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 p-4 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {item.icon}
                {item.label}
              </div>
              <div className="text-base font-semibold pl-7">{item.value}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
