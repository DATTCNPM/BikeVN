// components/common/DataTableToolbar.tsx
import { Plus, Search } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

type Props = {
  search: string;
  showSearch?: boolean;
  showCreate?: boolean;
  onSearchChange?: (value: string) => void;
  onCreateOpen?: () => void;
  onCreate?: () => void;
  children?: React.ReactNode; // UniversalFilterSheet sẽ được truyền vào đây
};

export default function DataTableToolbar({
  search,
  showSearch,
  showCreate,
  onSearchChange,
  onCreateOpen,
  onCreate,
  children,
}: Props) {
  const handleCreate = onCreateOpen || onCreate;

  return (
    <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      {/* Container bên trái: Gồm thanh Search và component Filter truyền qua children */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {showSearch && (
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Tìm kiếm..."
              className="h-12 rounded-2xl pl-11"
            />
          </div>
        )}

        {/* Nút Filter sẽ tự động hiển thị mượt mà ở đây */}
        {children}
      </div>

      {/* Nút tạo mới bên phải */}
      {showCreate && (
        <Button
          onClick={handleCreate}
          className="h-12 rounded-2xl px-5 font-semibold safety-button"
        >
          <Plus className="mr-2 size-5" />
          Create
        </Button>
      )}
    </div>
  );
}
