// components/payment/PaymentPolicyCard.tsx
import { Card } from "@repo/ui/components/ui/card";
import { ShieldCheck } from "lucide-react";

const POLICY_ITEMS = [
  "Deposit payment helps secure the bike for the selected period.",
  "Rental fees will be confirmed upon bike pickup.",
  "Refunds are subject to the timing of the booking cancellation.",
  "Transactions are encrypted and securely processed.",
] as const;

export default function PaymentPolicyCard() {
  return (
    <Card className="rounded-[2rem] border-border p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-7" />
        </div>

        <div>
          <h3 className="text-xl font-bold">Payment Policy</h3>
          <div className="mt-4 space-y-3 text-muted-foreground">
            {POLICY_ITEMS.map((item, index) => (
              <p key={index}>• {item}</p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
