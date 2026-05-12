import { ImagePlus, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSelectImage?: (file: File | null) => void;
};

export default function ChatInput({
  message,
  onChange,
  onSend,
  onSelectImage,
}: Props) {
  return (
    <footer className="border-t bg-background p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        <label className="flex size-12 cursor-pointer items-center justify-center rounded-2xl border bg-background transition hover:bg-accent">
          <ImagePlus className="size-5" />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onSelectImage?.(e.target.files?.[0] || null)}
          />
        </label>

        <Input
          value={message}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="h-12 rounded-2xl"
        />

        <Button onClick={onSend} size="icon" className="size-12 rounded-2xl">
          <SendHorizonal className="size-5" />
        </Button>
      </div>
    </footer>
  );
}
