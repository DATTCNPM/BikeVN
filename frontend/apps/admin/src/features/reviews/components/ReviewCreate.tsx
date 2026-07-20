import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import UniversalDialog from "@repo/ui/components/wrapper/UniversalDialog";
import { Input } from "@repo/ui/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { toast } from "@repo/ui/components/ui/sonner";

import { useCreateReview } from "../hooks/mutations";
import { reviewCreationSchema } from "@repo/schemas";
import type { ReviewCreationPayload } from "@repo/schemas";

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
      bookingId,
      rating: 5,
      comment: "",
    });
  }, [bookingId, reset]);

  const onSubmit = async (values: ReviewCreationPayload) => {
    console.log("Submitting review with values:", values);
    if (!bookingId) {
      toast.error("Booking ID is required");
      return;
    }
    try {
      await createReview({
        ...values,
      });
      toast.success("Review created successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to create review");
    }
  };

  return (
    <UniversalDialog
      type="form"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title="Create Review"
      description="Create a new review"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      submitLabel="Create Review"
    >
      <div className="grid gap-5">
        <FieldGroup>
          <input type="hidden" {...register("bookingId")} />
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
    </UniversalDialog>
  );
}
