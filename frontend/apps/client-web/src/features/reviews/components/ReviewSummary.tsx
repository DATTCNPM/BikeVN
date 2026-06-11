import { Star } from "lucide-react";

type Props = {
  averageRating: number;
  totalReviews: number;
};

export default function ReviewSummary({ averageRating, totalReviews }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/10 via-background to-background p-6">
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Rider Feedback
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Đánh giá từ khách hàng
          </h2>

          <p className="mt-2 max-w-xl text-muted-foreground">
            Trải nghiệm thực tế từ những khách hàng đã thuê xe. Độ hài lòng cao
            giúp bạn yên tâm hơn trước khi đặt xe.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-primary/10 bg-background/80 px-6 py-5 shadow-sm backdrop-blur">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Star className="size-8 fill-current" />
          </div>

          <div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black tracking-tight text-foreground">
                {averageRating.toFixed(1)}
              </span>

              <span className="pb-1 text-muted-foreground">/ 5</span>
            </div>

            <p className="text-sm text-muted-foreground">
              {totalReviews} đánh giá
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
