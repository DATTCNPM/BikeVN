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
    console.log("🚀 ~ file: ChatInput.tsx:24 ~ onSubmit ~ data:", data);
    onSend(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      // 🌟 SỬA: Tinh gọn p-4 thành p-3 (hoặc px-4 py-3)
      className="border-t bg-background px-4 py-3"
    >
      <div className="mx-auto flex max-w-4xl items-end gap-2">
        {/* 🌟 SỬA: Giảm kích thước nút đính kèm từ size-12 xuống size-10 */}
        <label className="flex size-10 cursor-pointer items-center justify-center rounded-xl border transition hover:bg-accent shrink-0">
          <ImagePlus className="size-4.5" />
          <input type="file" accept="image/*" className="hidden" />
        </label>

        <div className="flex flex-1 flex-col">
          <Input
            {...register("content")}
            placeholder="Type a message..."
            // 🌟 SỬA: Giảm chiều cao từ h-12 xuống h-10, đổi border-radius sang rounded-xl cho gọn
            className="h-10 rounded-xl text-xs"
            autoComplete="off"
          />
          {errors.content && (
            <span className="mt-1 text-[10px] text-red-500 pl-1 absolute -top-5 bg-background px-1 border rounded shadow-sm">
              {errors.content.message}
            </span>
          )}
        </div>

        {/* 🌟 SỬA: Giảm kích thước nút gửi xuống size-10 */}
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
