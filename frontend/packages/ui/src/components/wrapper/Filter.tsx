import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

export type FilterOption<T extends string = string> = {
  label: string;
  value: T;
};

type FilterProps<T extends string = string> = {
  title: string;
  options: FilterOption<T>[];
  value?: FilterOption<T>;
  onChange: (value?: FilterOption<T>) => void;
};

export default function Filter<T extends string>({
  title,
  options,
  value,
  onChange,
}: FilterProps<T>) {
  return (
    <Select
      value={value?.value}
      onValueChange={(val) => {
        const selected = options.find((o) => o.value === val);
        onChange(selected);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={title} />
      </SelectTrigger>

      <SelectContent className="z-[9999]">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
