import ReviewCard from "./ReviewCard";
import ReviewSummary from "./ReviewSummary";

import { useVehicleReviews } from "../hooks/useVehicleReviews";

type Props = {
  vehicleId: string;
};

export default function ReviewSection({ vehicleId }: Props) {
  const { data, isLoading } = useVehicleReviews({
    vehicleId: vehicleId,
    page: 1,
    size: 5,
  });
  const reviews = data?.data ?? [];

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;
  if (isLoading) {
    return (
      <section className="flex items-center justify-center py-10">
        <p className="text-muted-foreground"> Loading reviews...</p>
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
          <p className="text-muted-foreground">No reviews yet</p>
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
