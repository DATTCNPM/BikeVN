// components/common/DataTableToolbar.tsx
import { useState } from "react";
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
  children?: React.ReactNode;
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

  // 1. Quản lý trạng thái nhập liệu local và lưu vết giá trị search cũ
  const [localSearch, setLocalSearch] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  // 2. Đồng bộ trực tiếp ngay trong lúc render (Thay thế hoàn toàn cho useEffect)
  // Khi người dùng bấm Reset ở lớp cha, thuộc tính `search` truyền xuống sẽ thay đổi (ví dụ về rỗng "")
  if (search !== prevSearch) {
    setLocalSearch(search);
    setPrevSearch(search);
  }

  // 3. Hàm bắt sự kiện nhấn phím Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchChange?.(localSearch);
    }
  };

  return (
    <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      {/* Container bên trái: Gồm thanh Search và component Filter truyền qua children */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {showSearch && (
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="h-12 rounded-2xl pl-11"
            />
          </div>
        )}

        {/* Nút Filter tự động hiển thị ở đây */}
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
