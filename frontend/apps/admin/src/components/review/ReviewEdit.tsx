import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import EntityFormDialog from "@/components/common/EntityFormDialog";
import { Input } from "@repo/ui/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { toast } from "@repo/ui/components/ui/sonner";

import { useUpdateReview } from "@/features/reviews/mutations";
import { reviewAdminSchema, type ReviewAdminFormValues } from "@/features/reviews/schemas";
import type { Review } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
};

export default function ReviewEdit({ open, onOpenChange, review }: Props) {
  const { mutateAsync, isPending } = useUpdateReview();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewAdminFormValues>({
    resolver: zodResolver(reviewAdminSchema),
  });

  useEffect(() => {
    if (!review) return;
    reset({
      rating: review.rating,
      comment: review.comment,
    });
  }, [review, reset]);

  const onSubmit = async (values: ReviewAdminFormValues) => {
    if (!review) return;
    try {
      await mutateAsync({
        id: review.id,
        payload: {
          booking_id: review.booking_id,
          user_id: review.user_id,
          vehicle_id: review.vehicle_id,
          ...values,
        },
      });
      toast.success("Cập nhật đánh giá thành công");
      onOpenChange(false);
    } catch {
      toast.error("Cập nhật đánh giá thất bại");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Chỉnh sửa đánh giá"
      description="Cập nhật nội dung đánh giá"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Lưu thay đổi"
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Số sao (Rating)</FieldLabel>
            <Input type="number" min={1} max={5} {...register("rating", { valueAsNumber: true })} />
            {errors.rating && <FieldError>{errors.rating.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Nội dung bình luận</FieldLabel>
            <Input {...register("comment")} />
            {errors.comment && <FieldError>{errors.comment.message}</FieldError>}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
