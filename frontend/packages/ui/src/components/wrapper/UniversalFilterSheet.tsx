// @repo/ui/components/wrapper/UniversalFilterSheet.tsx
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Input } from "../ui/input"; // Đảm bảo bạn đã có Input component từ shadcn
import Filter, { type FilterOption } from "./Filter";

export type FilterConfigItem = {
  key: string;
  title: string;
  type?: "select" | "date" | "text"; // Bổ sung type để linh hoạt UI
  options?: FilterOption[]; // Chỉ bắt buộc nếu type là "select"
};

type Props = {
  title?: string;
  configs: FilterConfigItem[];
  value: Record<string, any>;
  onChange: (newValue: Record<string, any>) => void;
  onReset: () => void;
};

export default function UniversalFilterSheet({
  title = "Filters",
  configs,
  value,
  onChange,
  onReset,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(value);

  useEffect(() => {
    setLocalFilters(value);
  }, [value]);

  const handleApply = () => {
    onChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {title}
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto sm:max-w-md mx-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5 mx-auto">
          {configs.map((config) => {
            // Trường hợp 1: Bộ lọc dạng Ngày Tháng (Date)
            if (config.type === "date") {
              return (
                <div key={config.key} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {config.title}
                  </label>
                  <Input
                    type="date"
                    className="h-10 rounded-xl"
                    value={localFilters[config.key] || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        [config.key]: e.target.value,
                      }))
                    }
                  />
                </div>
              );
            }

            // Trường hợp 2: Bộ lọc dạng nhập Text (Ví dụ nhập chính xác ID)
            if (config.type === "text") {
              return (
                <div key={config.key} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {config.title}
                  </label>
                  <Input
                    type="text"
                    placeholder={`Enter ${config.title}...`}
                    className="h-10 rounded-xl"
                    value={localFilters[config.key] || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        [config.key]: e.target.value,
                      }))
                    }
                  />
                </div>
              );
            }

            // Trường hợp 3: Mặc định là Select Dropdown cũ
            return (
              <div key={config.key} className="space-y-2 flex flex-col">
                <label className="text-sm font-medium text-foreground">
                  {config.title}
                </label>
                <div className="w-full [&>button]:w-full">
                  {" "}
                  {/* Ép SelectTrigger của con bung full width */}
                  <Filter
                    title={config.title}
                    options={config.options || []}
                    value={localFilters[config.key]}
                    onChange={(selectedValue) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        [config.key]: selectedValue,
                      }))
                    }
                  />
                </div>
              </div>
            );
          })}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
