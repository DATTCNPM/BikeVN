import { CheckCircle2, Circle, XCircle } from "lucide-react"; // Import thêm XCircle

type Props = {
  status: string | null;
};

const STEPS = ["Booking Created", "Approved", "Completed"]; // Gộp "Booking Created" và "Pending Approval" cho gọn và khớp với logic BE

const STATUS_STEP_MAP: Record<string, number> = {
  pending: 0, // Khởi tạo xong đang đợi duyệt
  approved: 1, // Đã được duyệt
  completed: 2, // Đã hoàn thành chuyến đi
};

export default function BookingTimeline({ status }: Props) {
  const isFailed = status === "rejected" || status === "cancelled";

  // Nếu thất bại (hủy/từ chối), ta xem như dừng ở bước đầu tiên nhưng hiển thị màu đỏ
  const currentStep =
    status && STATUS_STEP_MAP[status] !== undefined
      ? STATUS_STEP_MAP[status]
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
        {/* Trường hợp đặc biệt: Bị huỷ hoặc bị từ chối */}
        {isFailed && (
          <div className="flex gap-4 rounded-2xl bg-destructive/10 p-4 border border-destructive/20">
            <XCircle className="size-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-destructive">
                {status === "rejected"
                  ? "Booking Rejected"
                  : "Booking Cancelled"}
              </p>
              <p className="text-sm text-muted-foreground">
                This booking has been terminated and cannot proceed.
              </p>
            </div>
          </div>
        )}

        {/* Tuyến trình thông thường (Ẩn đi nếu bị lỗi hoặc vẫn hiện để làm mờ - tùy bạn chọn, ở đây vẫn hiện để giữ cấu trúc UI) */}
        {!isFailed &&
          STEPS.map((step, index) => {
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
