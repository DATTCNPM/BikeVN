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
  return (
    <InputGroup className="max-w-md">
      <InputGroupInput
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{results} results</InputGroupAddon>
    </InputGroup>
  );
}
