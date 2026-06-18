import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { CheckCheck, MessageCircle, MessageSquare, User } from "lucide-react";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";

type Chat = {
  id: number;
  conversation_id: number;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

const chats: Chat[] = [
  {
    id: 1,
    conversation_id: 101,
    sender_name: "Nguyễn Văn A",
    content: "Tôi muốn thuê Honda Vision vào ngày mai.",
    is_read: true,
    created_at: "2026-05-14 09:20",
  },

  {
    id: 2,
    conversation_id: 101,
    sender_name: "Trần Thị B",
    content: "Chi nhánh Cà Mau còn xe không?",
    is_read: false,
    created_at: "2026-05-14 10:10",
  },
];

export default function ChatManagementPage() {
  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<Chat>[]>(
    () => [
      {
        accessorKey: "conversation_id",

        header: "Conversation",

        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageCircle className="size-5" />
            </div>

            <div>
              <p className="font-medium">#{row.original.conversation_id}</p>

              <p className="text-xs text-muted-foreground">Conversation</p>
            </div>
          </div>
        ),
      },

      {
        accessorKey: "sender_name",

        header: "Sender",

        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">{row.original.sender_name}</p>

              <p className="text-xs text-muted-foreground">User message</p>
            </div>
          </div>
        ),
      },

      {
        accessorKey: "content",

        header: "Message",

        cell: ({ row }) => (
          <div className="flex max-w-[350px] items-start gap-2">
            <MessageSquare className="mt-0.5 size-4 text-muted-foreground" />

            <span className="line-clamp-2 text-sm">{row.original.content}</span>
          </div>
        ),
      },

      {
        accessorKey: "is_read",

        header: "Status",

        cell: ({ row }) =>
          row.original.is_read ? (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
              <CheckCheck className="mr-1 size-3.5" />
              Read
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
              Unread
            </Badge>
          ),
      },

      {
        accessorKey: "created_at",

        header: "Time",
      },

      {
        id: "actions",

        header: "",

        cell: () => (
          <TableActionDropdown
            onEdit={() => console.log("view")}
            onDelete={() => console.log("delete")}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-5">
        <div className="mb-5 flex flex-col gap-4 rounded-3xl border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">Manage Messages</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Track conversations between customers and the system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="rounded-xl px-3 py-1">
              Total: 128 messages
            </Badge>

            <Badge className="rounded-xl px-3 py-1">12 unread</Badge>
          </div>
        </div>

        <DataTableToolbar
          search={search}
          onSearchChange={setSearch}
          onCreate={() => console.log("create conversation")}
        />
      </div>

      <DataTable columns={columns} data={chats} />

      <TablePagination
        page={1}
        totalPages={12}
        totalElements={128}
        pageSize={10}
        onPageChange={(page) => console.log(page)}
      />
    </div>
  );
}
