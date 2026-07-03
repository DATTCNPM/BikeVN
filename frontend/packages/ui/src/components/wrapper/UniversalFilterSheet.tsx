import { useState } from "react";
import { SlidersHorizontal, Calendar, FileText } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Input } from "../ui/input";
import Filter, { type FilterOption } from "./Filter";

export type FilterConfigItem = {
  key: string;
  title: string;
  type?: "select" | "date" | "text";
  options?: FilterOption[];
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
  const [prevValue, setPrevValue] = useState(value);

  // Đồng bộ hóa trực tiếp trong quá trình render (An toàn cho React mới)
  if (value !== prevValue) {
    setLocalFilters(value);
    setPrevValue(value);
  }

  const handleApply = () => {
    onChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
    setIsOpen(false);
  };

  const handleSelectChip = (key: string, option: FilterOption) => {
    setLocalFilters((prev) => {
      const isSelected = prev[key]?.value === option.value;
      if (isSelected) {
        // Nếu nhấn lại vào cái đang chọn -> Bỏ chọn
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: option };
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-12 rounded-2xl px-5 border-dashed border-2 hover:bg-muted/50 transition-all font-medium"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" />
          {title}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col h-full p-0 sm:max-w-md border-l border-border bg-background">
        {/* Header sang trọng */}
        <SheetHeader className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              {title}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Khu vực chứa các bộ lọc (Cuộn mượt mà) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
          {configs.map((config) => {
            // Loại 1: Bộ lọc Date
            if (config.type === "date") {
              return (
                <div
                  key={config.key}
                  className="space-y-2.5 pb-4 border-b border-border/50"
                >
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {config.title}
                  </label>
                  <Input
                    type="date"
                    className="h-11 rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/40"
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

            // Loại 2: Bộ lọc nhập văn bản dạng Text ngắn
            if (config.type === "text") {
              return (
                <div
                  key={config.key}
                  className="space-y-2.5 pb-4 border-b border-border/50"
                >
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="size-3.5" />
                    {config.title}
                  </label>
                  <Input
                    type="text"
                    placeholder={`Type ${config.title.toLowerCase()}...`}
                    className="h-11 rounded-xl bg-muted/40 border-border/60 focus-visible:ring-primary/40"
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

            // Loại 3: Tự động tối ưu hóa Select thành Nút bấm Chọn Nhanh (Chips) nếu số lượng options ít (<= 4)
            const showAsChips = config.options && config.options.length <= 4;

            if (showAsChips) {
              return (
                <div
                  key={config.key}
                  className="space-y-3 pb-4 border-b border-border/50"
                >
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {config.title}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {config.options?.map((option) => {
                      const isSelected =
                        localFilters[config.key]?.value === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleSelectChip(config.key, option)}
                          className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-foreground text-background border-foreground shadow-sm font-semibold"
                              : "bg-muted/40 text-muted-foreground border-border/60 hover:border-muted-foreground/60 hover:bg-muted"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Loại 4: Mặc định là Select Dropdown cũ đối với danh sách dài (Brand, Model, ...)
            return (
              <div
                key={config.key}
                className="space-y-2.5 pb-4 border-b border-border/50"
              >
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {config.title}
                </label>
                <div className="w-full [&>button]:w-full [&>button]:h-11 [&>button]:rounded-xl [&>button]:bg-muted/40">
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
        </div>

        {/* Footer cố định ở đáy (Sticky) vô cùng chuyên nghiệp */}
        <div className="p-4 bg-background border-t border-border grid grid-cols-2 gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <Button
            variant="ghost"
            className="h-12 rounded-xl font-semibold hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
            onClick={handleReset}
          >
            Reset All
          </Button>
          <Button
            className="h-12 rounded-xl font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-md transition-all"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
