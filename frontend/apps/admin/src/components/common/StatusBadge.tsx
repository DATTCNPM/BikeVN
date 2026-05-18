import { Badge } from "@repo/ui/components/ui/badge";

type Props = {
  status: "active" | "inactive" | "pending";
};

const statusMap = {
  active: {
    label: "Hoạt động",
    className:
      "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  },

  inactive: {
    label: "Ẩn",
    className: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  },

  pending: {
    label: "Đang xử lý",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  },
};

export default function StatusBadge({ status }: Props) {
  return (
    <Badge className={statusMap[status].className}>
      {statusMap[status].label}
    </Badge>
  );
}
