import { Card } from "@repo/ui/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PaymentPolicyCard() {
  const data = [
    "Thanh toán đặt cọc giúp giữ xe trong thời gian đã chọn.",
    "Tiền thuê sẽ được xác nhận khi nhận xe.",
    "Hoàn tiền tùy thuộc vào thời điểm hủy booking.",
    "Giao dịch được mã hóa và bảo mật an toàn.",
  ];
  return (
    <Card className="rounded-[2rem] border-border p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-7" />
        </div>

        <div>
          <h3 className="text-xl font-bold">Chính sách thanh toán</h3>

          <div className="mt-4 space-y-3 text-muted-foreground">
            {data.map((item, index) => (
              <p key={index}>• {item}</p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
