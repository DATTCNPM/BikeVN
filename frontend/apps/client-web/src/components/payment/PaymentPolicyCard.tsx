import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PaymentPolicyCard() {
  return (
    <Card className="rounded-[2rem] border-border p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-7" />
        </div>

        <div>
          <h3 className="text-xl font-bold">Chính sách thanh toán</h3>

          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>• Thanh toán đặt cọc giúp giữ xe trong thời gian đã chọn.</p>

            <p>• Tiền thuê sẽ được xác nhận khi nhận xe.</p>

            <p>• Hoàn tiền tùy thuộc vào thời điểm hủy booking.</p>

            <p>• Giao dịch được mã hóa và bảo mật an toàn.</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
