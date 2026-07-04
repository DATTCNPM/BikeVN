import type { ReactNode } from "react";

import { Card, CardContent } from "@repo/ui/components/ui/card";

type Props = {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export default function DashboardCard({
  title,
  value,
  description,
  icon,
  className,
}: Props) {
  return (
    <Card
      className={`rounded-3xl border-border/50 bg-card/80 shadow-sm backdrop-blur ${className}`}
    >
      <CardContent className="flex items-start justify-between p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>

          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {icon && (
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
