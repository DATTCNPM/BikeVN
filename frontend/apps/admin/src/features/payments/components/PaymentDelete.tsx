// import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
// import { useDeletePayment } from "@/features/payments/mutations";
// import { toast } from "@repo/ui/components/ui/sonner";
// import type { Payment } from "@repo/types";

// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   payment: Payment | null;
// };

// export default function PaymentDelete({ open, onOpenChange, payment }: Props) {
//   const { mutateAsync, isPending } = useDeletePayment();

//   const handleDelete = async () => {
//     if (!payment) return;
//     try {
//       await mutateAsync(payment.id);
//       toast.success("Xóa thanh toán thành công");
//       onOpenChange(false);
//     } catch {
//       toast.error("Xóa thanh toán thất bại");
//     }
//   };

//   return (
//     <ConfirmAlertDialog
//       open={open}
//       onOpenChange={onOpenChange}
//       title="Xóa thanh toán"
//       description={`Bạn có chắc chắn muốn xóa giao dịch thanh toán #${payment?.id.substring(0, 8)} không? Hành động này không thể hoàn tác.`}
//       onConfirm={handleDelete}
//       loading={isPending}
//       confirmText="Xóa"
//       cancelText="Hủy"
//     />
//   );
// }
