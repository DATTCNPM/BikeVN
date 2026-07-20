import { Card } from "@repo/ui/components/ui/card";
import { Mail, Phone, User2 } from "lucide-react";
import type { User } from "@repo/schemas";

export default function PaymentCustomerCard({
  user,
}: {
  user: User | undefined;
}) {
  return (
    <Card className="rounded-[2rem] border-border p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Customer
        </p>
        <h2 className="mt-1 text-xl font-bold">Customer Information</h2>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
        <InfoItem
          icon={<User2 className="size-4" />}
          label="Full Name"
          value={user?.name}
        />
        <InfoItem
          icon={<Mail className="size-4" />}
          label="Email Address"
          value={user?.email}
        />
        <InfoItem
          icon={<Phone className="size-4" />}
          label="Phone Number"
          value={user?.phone || "N/A"}
        />
        <InfoItem
          icon={<User2 className="size-4" />}
          label="National ID (CCCD)"
          value={user?.cccdNumber || "N/A"}
        />
      </div>
    </Card>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="rounded-2xl bg-muted/50 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="font-semibold text-sm text-foreground text-right truncate max-w-[180px]">
        {value}
      </p>
    </div>
  );
}
