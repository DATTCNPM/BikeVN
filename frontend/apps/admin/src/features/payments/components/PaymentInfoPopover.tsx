import {
  Calendar,
  Clock3,
  CreditCard,
  FileText,
  Landmark,
  Receipt,
  User,
} from "lucide-react";

import InfoPopover from "@/components/common/InfoPopover";

import type { Payment } from "@repo/types";

type Props = {
  payment: Payment;
};

export default function PaymentInfoPopover({ payment }: Props) {
  console.log(
    "🚀 ~ file: PaymentInfoPopover.tsx:22 ~ PaymentInfoPopover ~ payment:",
    payment,
  );
  return (
    <InfoPopover
      title="Payment Information"
      description="Transaction and bank details"
      items={[
        {
          icon: Receipt,
          label: "Transaction",
          value: payment.transactionCode ?? "-",
        },

        {
          icon: Calendar,
          label: "Created",
          value: new Date(payment.createdAt).toLocaleString("vi-VN"),
        },
        {
          icon: Clock3,
          label: "Updated",
          value: payment.updatedAt
            ? new Date(payment.updatedAt).toLocaleString("vi-VN")
            : "-",
        },
      ]}
    />
  );
}
