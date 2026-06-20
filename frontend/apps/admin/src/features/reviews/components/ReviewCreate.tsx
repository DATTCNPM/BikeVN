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

import { useCreateReview } from "@repo/hooks";
import { reviewCreationSchema } from "@repo/schemas";
import type { ReviewCreationPayload } from "@repo/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
};

export default function ReviewCreate({ open, onOpenChange, bookingId }: Props) {
  const { mutateAsync: createReview, isPending } = useCreateReview();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewCreationPayload>({
    resolver: zodResolver(reviewCreationSchema),
  });

  useEffect(() => {
    if (!bookingId) return;
    reset({
      rating: 5,
      comment: "",
    });
  }, [bookingId, reset]);

  const onSubmit = async (values: ReviewCreationPayload) => {
    if (!bookingId) return;
    try {
      await createReview({
        ...values,
        bookingId,
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
