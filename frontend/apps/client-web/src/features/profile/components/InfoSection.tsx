import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@repo/ui/components/ui/card";

import { User, Mail, Phone, CreditCard, Edit2 } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import UpdateProfile from "./UpdateProfile";
import { useProfile } from "@/features/profile/useProfile";
import { Spinner } from "@repo/ui/components/ui/spinner";

export default function InfoSection() {
  const { data: user, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner />
      </div>
    );
  }
  const infoItems = [
    {
      icon: <User className="text-muted-foreground" />,
      label: "Full Name",
      value: user?.name || "Chưa cập nhật",
    },
    {
      icon: <Mail className="text-muted-foreground" />,
      label: "Email",
      value: user?.email || "Chưa cập nhật",
    },
    {
      icon: <Phone className="text-muted-foreground" />,
      label: "Phone Number",
      value: user?.phone || "Chưa cập nhật",
    },
    {
      icon: <CreditCard className="text-muted-foreground" />,
      label: "ID Number",
      value: user?.cccdNumber || "Chưa cập nhật",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          Personal Information
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your identity and contact information.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            This information is used for authentication and security purposes.
          </CardDescription>
          <CardAction>
            <UpdateProfile
              userProfile={
                user
                  ? user
                  : {
                      id: "",
                      name: "",
                      email: "",

                      phone: "",
                      cccdNumber: "",
                      createdAt: "",
                      updatedAt: "",
                    }
              }
              trigger={
                <Button variant="outline">
                  <Edit2 className="w-4 h-4" />
                  <span className="ml-2">Edit Profile</span>
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
