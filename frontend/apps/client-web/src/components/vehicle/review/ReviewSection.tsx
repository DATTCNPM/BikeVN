import ReviewCard from "./ReviewCard";
import ReviewSummary from "./ReviewSummary";
import type { Review } from "@repo/types";

const reviews: Review[] = [
  {
    id: 1,
    booking_id: 12,
    user_id: 2,
    vehicle_id: 1,
    rating: 5,
    comment:
      "Xe chạy rất êm, tiết kiệm xăng và giao xe đúng giờ. Chủ shop hỗ trợ cực kỳ nhiệt tình.",
    created_at: "2026-05-12",
    user: {
      name: "Nguyễn Minh",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  },
  {
    id: 2,
    booking_id: 14,
    user_id: 4,
    vehicle_id: 1,
    rating: 4,
    comment: "Xe sạch sẽ, dễ lái. Thủ tục thuê nhanh và đơn giản.",
    created_at: "2026-05-10",
    user: {
      name: "Trần Quốc",
      avatar: "https://i.pravatar.cc/150?img=18",
    },
  },
  {
    id: 3,
    booking_id: 19,
    user_id: 5,
    vehicle_id: 1,
    rating: 5,
    comment: "Phù hợp đi phượt đường dài, máy khỏe và ổn định.",
    created_at: "2026-05-07",
    user: {
      name: "Lê Hoàng",
      avatar: "https://i.pravatar.cc/150?img=33",
    },
  },
];

export default function ReviewSection() {
  const averageRating =
    reviews.reduce((total, review) => total + review.rating, 0) /
    reviews.length;

  return (
    <section className="space-y-8">
      <ReviewSummary
        averageRating={averageRating}
        totalReviews={reviews.length}
      />

      <div className="grid gap-5">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
