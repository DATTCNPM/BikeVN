import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";

export default function SearchComponent({
  search,
  results = 0,
  onChange = () => {},
}: {
  search: string;
  results: number;
  onChange: (value: string) => void;
}) {
  return (
    <InputGroup className="max-w-md">
      <InputGroupInput
        placeholder="Search..."
        value={search}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{results} results</InputGroupAddon>
    </InputGroup>
  );
}
