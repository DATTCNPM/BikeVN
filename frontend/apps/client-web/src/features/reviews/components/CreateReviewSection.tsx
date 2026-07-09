import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Card } from "@repo/ui/components/ui/card";
import { toast } from "@repo/ui/components/ui/sonner";
import { useCreateReview } from "@repo/hooks";

type Props = { bookingId: string };

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
    <Card className="rounded-[2rem] p-5 space-y-4 shadow-sm border border-border">
      <div className="flex items-center justify-between border-b border-dashed pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Write a Review
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Share your experience
          </p>
        </div>

        {/* Đưa Star Rating lên trên cùng hàng tiêu đề */}
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const val = i + 1;
            return (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                className="transition-transform active:scale-95"
              >
                <Star
                  className={`size-5 ${val <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience..."
          rows={3} // Hạ xuống 3 dòng giúp form cực kỳ ngăn nắp
          className="rounded-xl text-xs resize-none focus-visible:ring-primary"
        />
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full h-10 text-xs font-bold rounded-xl bg-primary text-primary-foreground"
        >
          Submit Review
        </Button>
      </div>
    </Card>
  );
}
