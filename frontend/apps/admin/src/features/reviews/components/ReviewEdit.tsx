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
import {
  reviewAdminSchema,
  type ReviewAdminFormValues,
} from "@/features/reviews/schemas";
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
          rating: values.rating,
          comment: values.comment || undefined,
        },
      });
      toast.success("Update review successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update review");
    }
  };

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Review"
      description="Update review content"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitText="Save Changes"
    >
      <div className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Rating</FieldLabel>
            <Input
              type="number"
              min={1}
              max={5}
              {...register("rating", { valueAsNumber: true })}
            />
            {errors.rating && <FieldError>{errors.rating.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Comment</FieldLabel>
            <Input {...register("comment")} />
            {errors.comment && (
              <FieldError>{errors.comment.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </div>
    </EntityFormDialog>
  );
}
