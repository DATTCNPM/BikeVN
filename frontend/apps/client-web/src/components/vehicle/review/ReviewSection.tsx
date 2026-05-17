import ReviewCard from "./ReviewCard";
import ReviewSummary from "./ReviewSummary";

import { useVehicleReviews } from "@/hooks/useReview";

type Props = {
  vehicleId: string;
};

export default function ReviewSection({ vehicleId }: Props) {
  const { data: reviews = [], isLoading } = useVehicleReviews(vehicleId);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;
  console.log("vehicle ID:", vehicleId);
  console.log("reviews", reviews);
  if (isLoading) {
    return (
      <section className="flex items-center justify-center py-10">
        <p className="text-muted-foreground">Đang tải đánh giá...</p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <ReviewSummary
        averageRating={averageRating}
        totalReviews={reviews.length}
      />

      {reviews.length === 0 ? (
        <div className="rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">Chưa có đánh giá nào</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
