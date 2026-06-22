import { X } from "lucide-react";
import { useEffect, useMemo } from "react";

import { Input } from "@repo/ui/components/ui/input";

type Props = {
  value: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
};

export default function ImageUploadField({
  value,
  onChange,
  multiple = false,
}: Props) {
  const previews = useMemo(
    () =>
      value.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [value],
  );

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => {
          const newFiles = Array.from(e.target.files || []);

          onChange([...value, ...newFiles]);

          e.target.value = "";
        }}
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {previews.map((item, index) => (
            <div key={`${item.file.name}-${index}`} className="relative">
              <img
                src={item.url}
                alt={`Preview ${index + 1}`}
                className="h-40 w-full rounded-md border object-cover"
              />

              <button
                type="button"
                onClick={() => {
                  onChange(value.filter((_, i) => i !== index));
                }}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
