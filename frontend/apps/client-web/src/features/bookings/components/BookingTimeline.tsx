// components/booking/BookingTimeline.tsx

import { CheckCircle2, Circle } from "lucide-react";

type Props = {
  status: string | null;
};

const steps = ["Booking Created", "Pending Approval", "Approved", "Completed"];

export default function BookingTimeline({ status }: Props) {
  const currentStep =
    status === "pending"
      ? 1
      : status === "approved"
        ? 2
        : status === "completed"
          ? 3
          : 0;

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Timeline
        </p>

        <h2 className="mt-2 text-2xl font-bold">Booking Status</h2>
      </div>

      <div className="mt-8 space-y-6">
        {steps.map((step, index) => {
          const active = index <= currentStep;

          return (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex size-10 items-center justify-center rounded-full border ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {active ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <Circle className="size-5" />
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`mt-2 h-12 w-px ${
                      active ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>

              <div className="pt-2">
                <p className="font-semibold">{step}</p>

                <p className="text-sm text-muted-foreground">
                  {active ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
