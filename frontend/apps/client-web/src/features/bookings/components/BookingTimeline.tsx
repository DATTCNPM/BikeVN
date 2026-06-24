// components/booking/BookingTimeline.tsx
import { CheckCircle2, Circle } from "lucide-react";

type Props = {
  status: string | null;
};

const STEPS = ["Booking Created", "Pending Approval", "Approved", "Completed"];

const STATUS_STEP_MAP: Record<string, number> = {
  pending: 1,
  approved: 2,
  completed: 3,
};

export default function BookingTimeline({ status }: Props) {
  const currentStep = status ? (STATUS_STEP_MAP[status] ?? 0) : 0;

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Timeline
        </p>
        <h2 className="mt-2 text-2xl font-bold">Booking Status</h2>
      </div>

      <div className="mt-8 space-y-6">
        {STEPS.map((step, index) => {
          const isActive = index <= currentStep;

          return (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex size-10 items-center justify-center rounded-full border ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {isActive ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <Circle className="size-5" />
                  )}
                </div>

                {index !== STEPS.length - 1 && (
                  <div
                    className={`mt-2 h-12 w-px ${isActive ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>

              <div className="pt-2">
                <p className="font-semibold">{step}</p>
                <p className="text-sm text-muted-foreground">
                  {isActive ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
