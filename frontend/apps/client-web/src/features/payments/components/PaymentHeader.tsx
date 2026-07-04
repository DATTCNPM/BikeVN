import { CreditCard } from "lucide-react";

// Đổi cách nhận prop thành một object { type }
type Props = {
  type: "booking" | "surcharge";
};

export default function PaymentHeader({ type }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
      {/* Background Glow */}
      <div className="absolute right-0 top-0 size-24 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="size-5" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary/80">
              Checkout
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              {type === "booking" ? "Booking" : "Surcharge"} Payment
            </h1>
          </div>
        </div>

        <div className="text-xs font-medium text-muted-foreground hidden sm:block">
          Secure Transaction
        </div>
      </div>
    </section>
  );
}
