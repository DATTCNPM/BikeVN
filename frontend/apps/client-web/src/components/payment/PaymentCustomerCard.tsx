import { Card } from "@repo/ui/components/card";
import { Mail, Phone, User2 } from "lucide-react";
import type { User } from "@repo/types";

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

        <h2 className="mt-2 text-2xl font-bold">Thông tin người thuê</h2>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <InfoItem
          icon={<User2 className="size-5" />}
          label="Full Name"
          value={user?.name}
        />

        <InfoItem
          icon={<Mail className="size-5" />}
          label="Email"
          value={user?.email}
        />

        <InfoItem
          icon={<Phone className="size-5" />}
          label="Phone"
          value={user?.phone || "N/A"}
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
    <div className="rounded-2xl bg-muted/50 p-5">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <p className="text-sm font-medium">{label}</p>
      </div>

      <p className="mt-4 font-semibold text-foreground">{value}</p>
    </div>
  );
}
