import { Mail, Phone, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";
import { useBranches } from "@repo/hooks";

export default function InfoPage() {
  const { data: portalProfile, isLoading } = usePortalProfile();

  const { data: branches } = useBranches();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const initials =
    portalProfile?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AD";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Personal Information</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your admin account information.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <div className="mb-8 flex flex-col items-center gap-4 md:flex-row">
            <Avatar className="size-24">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-bold">{portalProfile?.name}</h2>

              <p className="text-muted-foreground">{portalProfile?.email}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>

              <div className="relative">
                <User className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={portalProfile?.name ?? ""}
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
                  value={portalProfile?.email ?? ""}
                  readOnly
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>

              <div className="relative">
                <Phone className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={portalProfile?.phone ?? ""}
                  readOnly
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>CCCD</Label>
              <div className="relative">
                <User className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={portalProfile?.cccdNumber ?? ""}
                  readOnly
                  className="h-11 rounded-2xl pl-11"
                />
              </div>
            </div>
            {portalProfile && (
              <div className="space-y-2">
                <Label>Branch</Label>
                <Input
                  value={
                    branches?.find((b) => b.id === portalProfile.branchId)
                      ?.name ?? "N/A"
                  }
                  readOnly
                  className="h-11 rounded-2xl"
                />
              </div>
            )}
          </div>

          <Button disabled className="mt-6 h-11 rounded-2xl">
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
