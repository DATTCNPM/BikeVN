import { Plus, Search } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate?: () => void;
  children?: React.ReactNode;
};

export default function DataTableToolbar({
  search,
  onSearchChange,
  onCreate,
  children,
}: Props) {
  return (
    <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-1 flex-col gap-3 lg:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm..."
            className="h-12 rounded-2xl pl-11"
          />
        </div>

        {children}
      </div>

      <Button
        onClick={onCreate}
        className="h-12 rounded-2xl px-5 font-semibold"
      >
        <Plus className="mr-2 size-5" />
        Thêm mới
      </Button>
    </div>
  );
}
