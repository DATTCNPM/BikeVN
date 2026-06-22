import { useState } from "react";

import { Star } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Card } from "@repo/ui/components/ui/card";
import { toast } from "@repo/ui/components/ui/sonner";

import { useCreateReview } from "@repo/hooks";

type Props = {
  bookingId: string;
};

export default function CreateReviewSection({ bookingId }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { mutateAsync, isPending } = useCreateReview();

  const handleSubmit = async () => {
    try {
      await mutateAsync({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success("Review submitted successfully");

      setComment("");
      setRating(5);
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <Card className="rounded-3xl p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold">Write a Review</h3>

          <p className="text-sm text-muted-foreground mt-1">
            Share your rental experience.
          </p>
        </div>

        <div>
          <p className="mb-3 font-medium">Rating</p>

          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                >
                  <Star
                    className={`size-8 transition-colors ${
                      value <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 font-medium">Comment</p>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={5}
          />
        </div>

        <Button onClick={handleSubmit} disabled={isPending}>
          Submit Review
        </Button>
      </div>
    </Card>
  );
}
