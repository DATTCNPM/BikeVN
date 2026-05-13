import { CreditCard } from "lucide-react";

export default function PaymentHeader() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm">
      <div className="absolute right-0 top-0 size-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Thanh toán booking
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Hoàn tất thanh toán để xác nhận đặt xe và bắt đầu hành trình của
            bạn.
          </p>
        </div>

        <div className="flex size-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
          <CreditCard className="size-10" />
        </div>
      </div>
    </section>
  );
}
