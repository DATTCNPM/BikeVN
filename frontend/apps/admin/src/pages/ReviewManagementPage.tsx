import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { MessageSquare, Star } from "lucide-react";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Spinner } from "@repo/ui/components/ui/spinner";
import { Badge } from "@repo/ui/components/ui/badge";

import ReviewDelete from "@/features/reviews/components/ReviewDelete";
import ReviewCreate from "@/features/reviews/components/ReviewCreate";

import { useAdminReviews } from "@/features/reviews/queries/useAdminReviews";

import type { Review } from "@repo/types";

export default function ReviewManagementPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [search, setSearch] = useState("");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const { data, isLoading } = useAdminReviews({
    page,
    size: pageSize,
  });

  const reviews = data?.data ?? [];

  const columns = useMemo<ColumnDef<Review>[]>(
    () => [
      {
        accessorKey: "bookingId",
        header: "Booking ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            #{row.original.bookingId.slice(0, 6)}
          </span>
        ),
      },
      {
        accessorKey: "userId",
        header: "User ID",
        cell: ({ row }) => (
          <span className="text-sm">
            User #{row.original.userId.slice(0, 6)}
          </span>
        ),
      },
      {
        accessorKey: "vehicleId",
        header: "Vehicle ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            Xe #{row.original.vehicleId.slice(0, 6)}
          </span>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
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
        header: "Comment",
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
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleString("vi-VN"),
      },
      {
        id: "status",
        header: "Status",
        cell: () => (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
            Visible
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <TableActionDropdown
            onDelete={() => {
              setSelectedReview(row.original);
              setOpenDeleteDialog(true);
            }}
          />
        ),
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={() => setOpenCreateDialog(true)}
      />

      <DataTable columns={columns} data={reviews} />

      <TablePagination
        page={data?.currentPage || 1}
        pageSize={data?.pageSize || 10}
        totalElements={data?.totalElements || 0}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />

      <ReviewDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        review={selectedReview}
      />

      <ReviewCreate
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        review={null}
      />
    </div>
  );
}
