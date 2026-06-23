import { Button } from "@repo/ui/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";

import { CircleHelp } from "lucide-react";

type InfoItem = {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
};

type Props = {
  title: string;
  description?: string;
  items: InfoItem[];
};

function InfoRow({ icon: Icon, label, value }: InfoItem) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        <span className="text-sm">{label}</span>
      </div>

      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

export default function InfoPopover({ title, description, items }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="size-8">
          <CircleHelp className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-4">
        <div className="mb-3 border-b pb-3">
          <h4 className="text-sm font-semibold">{title}</h4>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="space-y-1">
          {items.map((item) => (
            <InfoRow key={item.label} {...item} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
