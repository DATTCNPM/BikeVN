import { ImagePlus, SendHorizonal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { chatMessageRequestSchema } from "@repo/schemas";

type Props = {
  onSend: (data: { content: string }) => void;
};

export default function ChatInput({ onSend }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ content: string }>({
    resolver: zodResolver(chatMessageRequestSchema.pick({ content: true })),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: { content: string }) => {
    onSend(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-t bg-background p-4"
    >
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        <label className="flex size-12 cursor-pointer items-center justify-center rounded-2xl border transition hover:bg-accent">
          <ImagePlus className="size-5" />
          <input type="file" accept="image/*" className="hidden" />
        </label>

        <div className="flex flex-1 flex-col">
          <Input
            {...register("content")}
            placeholder="Nhập tin nhắn..."
            className="h-12 rounded-2xl"
            autoComplete="off"
          />
          {errors.content && (
            <span className="mt-1 text-xs text-red-500 pl-1">
              {errors.content.message}
            </span>
          )}
        </div>

        <Button type="submit" size="icon" className="size-12 rounded-2xl">
          <SendHorizonal className="size-5" />
        </Button>
      </div>
    </form>
  );
}
