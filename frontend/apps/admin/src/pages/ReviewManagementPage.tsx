import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { MessageSquare, Star } from "lucide-react";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Badge } from "@/components/ui/badge";

type Review = {
  id: number;
  booking_id: number;
  user_id: number;
  vehicle_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
};

const reviews: Review[] = [
  {
    id: 1,
    booking_id: 5,
    user_id: 10,
    vehicle_id: 3,
    rating: 5,
    comment: "Xe chạy rất tốt và sạch sẽ.",
    created_at: "2026-05-14 09:00",
  },
];

export default function ReviewManagementPage() {
  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<Review>[]>(
    () => [
      {
        accessorKey: "booking_id",
        header: "Mã đơn",
      },

      {
        accessorKey: "user_id",
        header: "Mã người dùng",
      },

      {
        accessorKey: "vehicle_id",
        header: "Mã xe",
      },

      {
        accessorKey: "rating",
        header: "Đánh giá",

        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {Array.from({
              length: row.original.rating,
            }).map((_, index) => (
              <Star
                key={index}
                className="size-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        ),
      },

      {
        accessorKey: "comment",
        header: "Bình luận",

        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-muted-foreground" />

            <span className="max-w-[300px] truncate">
              {row.original.comment || "--"}
            </span>
          </div>
        ),
      },

      {
        accessorKey: "created_at",
        header: "Ngày đánh giá",
      },

      {
        id: "status",

        header: "Trạng thái",

        cell: () => (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
            Hiển thị
          </Badge>
        ),
      },

      {
        id: "actions",

        header: "",

        cell: () => (
          <TableActionDropdown
            onEdit={() => console.log("edit")}
            onDelete={() => console.log("delete")}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={() => console.log("create")}
      />

      <DataTable columns={columns} data={reviews} />

      <TablePagination
        page={1}
        totalPages={8}
        onPageChange={(page) => console.log(page)}
      />
    </div>
  );
}
