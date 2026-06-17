import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/ui/combobox";

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
    <Combobox
      items={options}
      value={value}
      onValueChange={(selected) =>
        onChange(selected as FilterOption<T> | undefined)
      }
    >
      <ComboboxInput placeholder={title} showClear />

      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>

        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
