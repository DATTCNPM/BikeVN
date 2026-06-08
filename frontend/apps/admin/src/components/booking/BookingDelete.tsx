// import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
// import { toast } from "@repo/ui/components/ui/sonner";
// import type { Booking } from "@repo/types";

// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   booking: Booking | null;
// };

// export default function BookingDelete({ open, onOpenChange, booking }: Props) {
//   const { mutateAsync, isPending } = useDeleteBooking();

//   const handleDelete = async () => {
//     if (!booking) return;
//     try {
//       await mutateAsync(booking.id);
//       toast.success("Xóa đơn đặt xe thành công");
//       onOpenChange(false);
//     } catch {
//       toast.error("Xóa đơn đặt xe thất bại");
//     }
//   };

//   return (
//     <ConfirmAlertDialog
//       open={open}
//       onOpenChange={onOpenChange}
//       title="Xóa đơn đặt xe"
//       description={`Bạn có chắc chắn muốn xóa đơn đặt xe #${booking?.id} không? Hành động này không thể hoàn tác.`}
//       onConfirm={handleDelete}
//       loading={isPending}
//       confirmText="Xóa"
//       cancelText="Hủy"
//     />
//   );
// }
