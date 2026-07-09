import { Card } from "@repo/ui/components/ui/card";
import { ReceiptText, CheckCircle2 } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import type { VehicleReturn } from "@repo/types";
import { useNavigate } from "react-router-dom";

type Props = {
  vehicleReturn: VehicleReturn | null | undefined;
};

export default function ReturnSurchargeCard({ vehicleReturn }: Props) {
  const navigate = useNavigate();

  if (!vehicleReturn?.extraFee) return null;

  const isPaid = vehicleReturn.payment?.status === "completed";

  return (
    <Card className="rounded-[2rem] border-amber-500/30 bg-amber-500/5 p-5 shadow-sm space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-amber-600">
        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10">
          <ReceiptText className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700">
            Surcharge Invoice
          </h3>
          <p className="text-[11px] text-amber-600/80">
            Vehicle Return Inspection
          </p>
        </div>
      </div>

      {/* Details Box */}
      <div className="rounded-xl bg-card border border-amber-500/10 p-3 space-y-2 text-xs">
        <div className="flex justify-between items-center pb-2 border-b border-dashed">
          <span className="text-muted-foreground">Vehicle Condition</span>
          <span className="font-bold uppercase text-amber-600 bg-amber-500/15 px-2 py-0.5 rounded-md text-[10px]">
            {vehicleReturn.conditionStatus}
          </span>
        </div>

        {vehicleReturn.damageDescription && (
          <div className="space-y-1">
            <span className="text-muted-foreground block">
              Damage Assessment:
            </span>
            <p className="font-medium text-foreground italic bg-muted/50 p-2 rounded-lg text-[11px]">
              "{vehicleReturn.damageDescription}"
            </p>
          </div>
        )}
      </div>

      {/* Pricing Summary */}
      <div className="pt-2 border-t border-dashed border-amber-500/20 flex items-baseline justify-between">
        <span className="text-sm font-medium text-amber-900">
          Additional Due:
        </span>
        <span className="text-2xl font-black tracking-tight text-amber-600">
          {vehicleReturn.extraFee.toLocaleString("vi-VN")}đ
        </span>
      </div>

      {/* Action Button */}
      <Button
        className={`w-full h-11 rounded-xl text-xs font-bold shadow-md transition-all ${
          isPaid
            ? "bg-emerald-600 hover:bg-emerald-600 text-white cursor-default"
            : "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/10"
        }`}
        disabled={isPaid}
        onClick={() =>
          navigate(`/payment/${vehicleReturn.bookingId}?type=surcharge`)
        }
      >
        {isPaid ? (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="size-4" /> Surcharge Paid
          </span>
        ) : (
          "Pay Surcharge Now"
        )}
      </Button>
    </Card>
  );
}
