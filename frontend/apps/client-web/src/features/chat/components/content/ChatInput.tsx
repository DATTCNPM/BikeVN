import { ImagePlus, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

import { sendMessageSchema, type SendMessagePayload } from "@/features/chat/schemas";

type Props = {
  onSend: (data: SendMessagePayload) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMessagePayload>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: SendMessagePayload) => {
    onSend({ ...data, image });
    reset();
    setImage(null);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-t bg-background p-4"
    >
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        {/* Image */}
        <label className="flex size-12 cursor-pointer items-center justify-center rounded-2xl border transition hover:bg-accent">
          <ImagePlus className="size-5" />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>

        {/* Message */}
        <div className="flex flex-1 flex-col">
          <Input
            {...register("content")}
            placeholder="Nhập tin nhắn..."
            className="h-12 rounded-2xl"
          />

          {errors.content && (
            <span className="mt-1 text-xs text-red-500">
              {errors.content.message}
            </span>
          )}
        </div>

        {/* Send */}
        <Button type="submit" size="icon" className="size-12 rounded-2xl">
          <SendHorizonal className="size-5" />
        </Button>
      </div>
    </form>
  );
}
