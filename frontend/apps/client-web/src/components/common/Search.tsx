import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";

export default function SearchComponent({
  search,
  results = 0,
}: {
  search: string;
  results: number;
}) {
  return (
    <InputGroup className="max-w-md">
      <InputGroupInput placeholder="Search..." value={search} />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{results} results</InputGroupAddon>
    </InputGroup>
  );
}
