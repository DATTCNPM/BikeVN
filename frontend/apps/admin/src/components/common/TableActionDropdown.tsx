import { MoreHorizontal, Pencil, Trash2, Image } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

type Props = {
  onEdit?: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onManageImage?: () => void | Promise<void>;
};

export default function TableActionDropdown({
  onEdit,
  onDelete,
  onManageImage,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 rounded-2xl">
        {onManageImage && (
          <DropdownMenuItem onClick={() => void onManageImage?.()}>
            <Image className="mr-2 size-4" />
            Quản lý hình ảnh
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => void onEdit?.()}>
          <Pencil className="mr-2 size-4" />
          Chỉnh sửa
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => void onDelete?.()}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
