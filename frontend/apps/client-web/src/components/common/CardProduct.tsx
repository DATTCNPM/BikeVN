import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CardProductProps = {
  id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  status: string;
  image: string;
};

export default function CardProduct({
  id,
  title,
  type,
  price,
  location,
  status,
  image,
}: CardProductProps) {
  const navigate = useNavigate();
  const handleViewDetails = ({ id }: { id: string }) => {
    navigate(`/vehicles/${id}`);
  };
  return (
    <Card className="group pt-0 overflow-hidden border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-card dark:border-border">
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent dark:from-black/80 dark:via-black/20 dark:to-transparent" />

        {/* Badge */}
        <Badge variant="default" className="absolute top-2 right-2">
          {status}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground dark:text-muted-foreground">
              {type}
            </p>

            <h3 className="line-clamp-2 text-3xl font-semibold tracking-tight text-card-foreground dark:text-card-foreground">
              {title}
            </h3>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-4xl font-bold text-primary dark:text-primary">
              ${price.toFixed(0)}
            </p>

            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground dark:text-muted-foreground">
              Per Day
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground">
          <MapPin className="size-4" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1 gap-2 font-semibold uppercase tracking-wide shadow-sm">
            Book Now
            <ArrowRight className="size-4" />
          </Button>

          <Button
            variant="outline"
            className="flex-1 border-border bg-background font-semibold uppercase tracking-wide hover:bg-accent hover:text-accent-foreground dark:bg-transparent dark:hover:bg-accent"
            onClick={() => handleViewDetails({ id })} // Use the actual vehicle ID
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
