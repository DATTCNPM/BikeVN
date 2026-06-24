// components/booking/BookingActions.tsx
import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight, Bike, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookingActions() {
  const navigate = useNavigate();

  return (
    <aside className="h-fit rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wider text-primary">
        Actions
      </p>
      <h2 className="mt-2 text-2xl font-bold">What's Next?</h2>

      <div className="mt-6 flex flex-col gap-4">
        <Button
          size="lg"
          className="h-12 rounded-2xl"
          onClick={() => navigate("/profile/bookings")}
        >
          <ClipboardList className="mr-2 size-5" />
          My Booking
        </Button>

        <Button
          size="lg"
          variant="secondary"
          className="h-12 rounded-2xl"
          onClick={() => navigate("/home")}
        >
          <Bike className="mr-2 size-5" />
          Continue Browsing
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-12 rounded-2xl"
          onClick={() => navigate("/chat")}
        >
          Contact Support
          <ArrowRight className="ml-2 size-5" />
        </Button>
      </div>

      <div className="mt-8 rounded-2xl bg-primary/10 p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Need help with your booking? Our support team is here to assist you
          with any questions or issues you may have.
        </p>
      </div>
    </aside>
  );
}
