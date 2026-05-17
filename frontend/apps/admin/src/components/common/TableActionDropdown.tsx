import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function TableActionDropdown({ onEdit, onDelete }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 rounded-2xl">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 size-4" />
          Chỉnh sửa
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
