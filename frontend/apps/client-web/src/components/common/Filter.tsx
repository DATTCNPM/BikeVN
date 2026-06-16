import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/ui/combobox";

type Option = {
  label: string;
  value: string;
};

type FilterProps = {
  title: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
};
export default function Filter({
  title,
  options,
  value,
  onChange,
}: FilterProps) {
  return (
    <Combobox items={options} value={value} onValueChange={onChange}>
      <ComboboxInput placeholder={title} />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>

        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
