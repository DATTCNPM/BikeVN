import { Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import type { DashboardOverview } from "@repo/types";

type Props = {
  data: DashboardOverview["recentReviews"];
};

export default function RecentReviews({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-border/50 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium">{review.user}</h4>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`size-4 ${
                      index < review.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {review.comment}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
