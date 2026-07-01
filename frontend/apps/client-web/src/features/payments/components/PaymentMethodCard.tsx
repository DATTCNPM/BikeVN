// components/payment/PaymentMethodCard.tsx
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
    name: "VNPay",
    description: "Thanh toán qua cổng VNPay (ATM / QR Code)",
    icon: Landmark,
    isAvailable: true,
  },
  {
    id: "momo",
    name: "MoMo",
    description: "Ví điện tử MoMo",
    icon: Wallet,
    isAvailable: false,
  },
  {
    id: "cash",
    name: "Cash",
    description: "Thanh toán bằng tiền mặt",
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

      <div className="mt-8 grid gap-4">
        {PAYMENT_METHODS.map((method) => {
          const isActive = selectedMethod === method.id;
          const Icon = method.icon;

          return (
            <button
              key={method.id}
              disabled={!method.isAvailable}
              onClick={() => onMethodSelect(method.id)}
              className={`flex items-center justify-between rounded-3xl border p-5 text-left transition-all duration-300 ${
                isActive
                  ? "border-primary bg-primary/10"
                  : method.isAvailable
                    ? "border-border hover:border-primary/30"
                    : "border-border opacity-50 cursor-not-allowed bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <Icon className="size-6" />
                </div>

                <div>
                  <p className="font-semibold">{method.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>

              {isActive && (
                <Badge className="rounded-full px-4 py-1">Selected</Badge>
              )}
              {!method.isAvailable && (
                <Badge
                  variant="outline"
                  className="rounded-full border-muted-foreground/30 px-3 py-1 text-muted-foreground"
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
