import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal } from "lucide-react";
import { chatMessageRequestSchema } from "@repo/schemas";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

interface ChatInputFormProps {
  activeTitle: string;
  onSend: (content: string) => void;
}

export function ChatInputForm({ activeTitle, onSend }: ChatInputFormProps) {
  const { register, handleSubmit, reset } = useForm<{ content: string }>({
    resolver: zodResolver(chatMessageRequestSchema.pick({ content: true })),
    defaultValues: { content: "" },
  });

  const onSubmitForm = (data: { content: string }) => {
    if (!data.content.trim()) return;
    onSend(data.content);
    reset();
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmitForm)(e);
      }}
      className="border-t bg-background p-4 flex-shrink-0"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <Input
          {...register("content")}
          placeholder={`Reply to ${activeTitle}...`}
          className="h-11 rounded-xl"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          className="h-11 w-11 rounded-xl flex-shrink-0"
        >
          <SendHorizonal className="size-4" />
        </Button>
      </div>
    </form>
  );
}
