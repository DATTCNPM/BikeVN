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
    defaultValues: { content: "" },
  });

  const onSubmit = (data: { content: string }) => {
    if (!data.content.trim()) return;
    onSend(data);
    reset();
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      className="border-t bg-background px-4 py-3 flex-shrink-0"
    >
      <div className="mx-auto flex max-w-4xl items-center gap-2">
        <label className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 transition hover:bg-accent shrink-0">
          <ImagePlus className="size-4.5 text-muted-foreground" />
          <input type="file" accept="image/*" className="hidden" />
        </label>

        <div className="flex flex-1 flex-col relative">
          <Input
            {...register("content")}
            placeholder="Type a message..."
            className="h-10 rounded-xl text-sm"
            autoComplete="off"
          />
          {errors.content && (
            <span className="text-[10px] text-destructive pl-1 mt-0.5 absolute top-full left-0">
              {errors.content.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="icon"
          className="size-10 rounded-xl shrink-0"
        >
          <SendHorizonal className="size-4.5" />
        </Button>
      </div>
    </form>
  );
}
