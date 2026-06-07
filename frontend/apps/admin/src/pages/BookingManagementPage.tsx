import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
// import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";
import { Spinner } from "@repo/ui/components/ui/spinner";

import { Badge } from "@repo/ui/components/ui/badge";

// import BookingCreate from "@/components/booking/BookingCreate";
// import BookingEdit from "@/components/booking/BookingEdit";
// import BookingDelete from "@/components/booking/BookingDelete";

import { useBookings } from "@/features/bookings/queries";
import type { Booking } from "@repo/types";

const bookingStatusMap = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  approved: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  cancelled: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
};

const bookingStatusLabel = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function BookingManagementPage() {
  const { data: bookings = [], isLoading } = useBookings();

  // const [openCreateDialog, setOpenCreateDialog] = useState(false);
  // const [openEditDialog, setOpenEditDialog] = useState(false);
  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "user_id",
        header: "Khách hàng",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            User #{row.original.userId.substring(0, 4)}
          </span>
        ),
      },
      {
        accessorKey: "vehicle_id",
        header: "Xe",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            Xe #{row.original.vehicleId.substring(0, 4)}
          </span>
        ),
      },
      {
        accessorKey: "pickup_branch_id",
        header: "Chi nhánh nhận",
        cell: ({ row }) => (
          <span className="text-sm">
            CN #{row.original.pickupBranchId.substring(0, 4)}
          </span>
        ),
      },
      {
        accessorKey: "return_branch_id",
        header: "Chi nhánh trả",
        cell: ({ row }) => (
          <span className="text-sm">
            CN #{row.original.returnBranchId.substring(0, 4)}
          </span>
        ),
      },
      {
        accessorKey: "start_date",
        header: "Bắt đầu",
        cell: ({ row }) =>
          new Date(row.original.startTime).toLocaleDateString("vi-VN"),
      },
      {
        accessorKey: "end_date",
        header: "Kết thúc",
        cell: ({ row }) =>
          new Date(row.original.endTime).toLocaleDateString("vi-VN"),
      },
      {
        accessorKey: "total_price",
        header: "Tổng tiền",
        cell: ({ row }) => `${row.original.totalPrice?.toLocaleString()}đ`,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge className={bookingStatusMap[row.original.status]}>
            {bookingStatusLabel[row.original.status]}
          </Badge>
        ),
      },
      // {
      //   id: "actions",
      //   header: "",
      //   cell: ({ row }) => (
      //     <TableActionDropdown
      //       onEdit={() => {
      //         setSelectedBooking(row.original);
      //         setOpenEditDialog(true);
      //       }}
      //       onDelete={() => {
      //         setSelectedBooking(row.original);
      //         setOpenDeleteDialog(true);
      //       }}
      //     />
      //   ),
      // },
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

  console.log("Bookings:", bookings);

  return (
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateOpen={() => setOpenCreateDialog(true)}
      />

      <DataTable columns={columns} data={bookings} />

      <TablePagination
        page={1}
        totalPages={Math.ceil(bookings.length / 10) || 1}
        onPageChange={(page) => console.log(page)}
      />

      {/* <BookingCreate
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      <BookingEdit
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        booking={selectedBooking}
      />
      <BookingDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        booking={selectedBooking}
      /> */}
    </div>
  );
}
