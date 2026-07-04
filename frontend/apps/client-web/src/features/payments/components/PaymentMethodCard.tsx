import { Card } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import type { PaymentMethod } from "@repo/types";

type Props = {
  selectedMethod: PaymentMethod;
  onMethodSelect: (method: PaymentMethod) => void;
};

const PAYMENT_METHODS = [
  {
    id: "vnpay",
    name: "VNPay Gateway",
    description:
      "Pay via VNPay gateway (Supports Local ATM cards / QR Code scan)",
    icon: Landmark,
    isAvailable: true,
  },
  {
    id: "momo",
    name: "MoMo Wallet",
    description: "Pay using MoMo E-wallet application",
    icon: Wallet,
    isAvailable: false,
  },
  {
    id: "cash",
    name: "Cash Payment",
    description: "Pay directly in cash upon vehicle collection",
    icon: CreditCard,
    isAvailable: true,
  },
] as const;

export default function PaymentMethodCard({
  selectedMethod,
  onMethodSelect,
}: Props) {
  return (
    <Card className="rounded-[2rem] border-border p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Payment Method
        </p>
        <h2 className="mt-2 text-2xl font-bold">Select Payment Method</h2>
      </div>

      <div className="mt-6 grid gap-3">
        {PAYMENT_METHODS.map((method) => {
          const isActive = selectedMethod === method.id;
          const Icon = method.icon;

          return (
            <button
              key={method.id}
              disabled={!method.isAvailable}
              onClick={() => onMethodSelect(method.id)}
              className={`flex items-center justify-between rounded-3xl border p-4 text-left transition-all duration-300 ${
                isActive
                  ? "border-primary bg-primary/10"
                  : method.isAvailable
                    ? "border-border hover:border-primary/30"
                    : "border-border opacity-50 cursor-not-allowed bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <Icon className="size-5" />
                </div>

                <div>
                  <p className="font-semibold text-sm">{method.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>

              {isActive && (
                <Badge className="rounded-full px-3 py-0.5 text-xs">
                  Selected
                </Badge>
              )}
              {!method.isAvailable && (
                <Badge
                  variant="outline"
                  className="rounded-full border-muted-foreground/30 px-3 py-0.5 text-xs text-muted-foreground"
                >
                  Coming Soon
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
