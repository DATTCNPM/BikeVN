import { useState } from "react";
import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";

export default function SearchComponent({
  value,
  results = 0,
  onChange = () => {},
}: {
  value: string;
  results: number;
  onChange: (value: string) => void;
}) {
  // 1. Khởi tạo state nội bộ kiểm soát ký tự đang gõ
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // 2. Đồng bộ trực tiếp ngay trong render khi nút "Reset" ở trang cha được bấm
  if (value !== prevValue) {
    setLocalValue(value);
    setPrevValue(value);
  }

  // 3. Hàm bắt sự kiện nhấn phím Enter để kích hoạt tìm kiếm ra API bên ngoài
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onChange(localValue);
    }
  };

  return (
    <InputGroup className="max-w-md">
      <InputGroupInput
        placeholder="Enter name vehicle to search..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <InputGroupAddon>
        <Search className="size-4 text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{results} results</InputGroupAddon>
    </InputGroup>
  );
}
