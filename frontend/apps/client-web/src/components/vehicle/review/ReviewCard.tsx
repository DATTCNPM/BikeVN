import { Star } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Card } from "@repo/ui/components/card";

import type { Review } from "@repo/types";

type Props = {
  review: Review;
};

const avatarList = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Alex",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Emma",
];

const getRandomAvatar = (id: string) => {
  const index =
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarList.length;

  return avatarList[index];
};

export default function ReviewCard({ review }: Props) {
  const avatar = getRandomAvatar(review.user_id);

  return (
    <Card className="rounded-3xl border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 border-2 border-primary/20">
            <AvatarImage src={avatar} />

            <AvatarFallback>
              {review.user_id.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h4 className="font-semibold text-foreground">
              {review.user?.name || review.user_id}
            </h4>

            <p className="text-sm text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const active = index < review.rating;

            return (
              <Star
                key={index}
                className={`size-4 ${
                  active
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/40"
                }`}
              />
            );
          })}
        </div>
      </div>

      {review.comment && (
        <div className="mt-4 rounded-2xl bg-muted/60 p-4">
          <p className="leading-7 text-muted-foreground">{review.comment}</p>
        </div>
      )}
    </Card>
  );
}
