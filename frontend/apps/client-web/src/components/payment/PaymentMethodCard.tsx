import { useState } from "react";
import { Card } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { CreditCard, Landmark, Wallet } from "lucide-react";

const methods = [
  {
    id: "vnpay",
    name: "VNPay",
    description: "Thanh toán qua VNPay Gateway",
    icon: Landmark,
  },

  {
    id: "momo",
    name: "MoMo",
    description: "Ví điện tử MoMo",
    icon: Wallet,
  },

  {
    id: "card",
    name: "Credit Card",
    description: "Visa / Mastercard",
    icon: CreditCard,
  },
];

export default function PaymentMethodCard() {
  const [selectedMethod, setSelectedMethod] = useState("vnpay");

  return (
    <Card className="rounded-[2rem] border-border p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Payment Method
        </p>

        <h2 className="mt-2 text-2xl font-bold">Chọn phương thức thanh toán</h2>
      </div>

      <div className="mt-8 grid gap-4">
        {methods.map((method) => {
          const active = selectedMethod === method.id;

          const Icon = method.icon;

          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`flex items-center justify-between rounded-3xl border p-5 text-left transition-all duration-300 ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
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

              {active && (
                <Badge className="rounded-full px-4 py-1">Selected</Badge>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
