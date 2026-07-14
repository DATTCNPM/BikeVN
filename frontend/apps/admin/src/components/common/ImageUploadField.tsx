import { X } from "lucide-react";
import { useEffect, useState } from "react";
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
  // 🌟 Quản lý danh sách URL string độc lập để tránh bị gối đầu dọn dẹp lỗi của useMemo
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // Tạo danh sách URL mới dựa trên mảng file hiện tại
    const urls = value.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // 🌟 Chỉ dọn dẹp (revoke) các URL cũ khi component thực sự unmount hoặc mảng file thay đổi một cách an toàn
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [value]);

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => {
          const newFiles = Array.from(e.target.files || []);

          if (multiple) {
            onChange([...value, ...newFiles]);
          } else {
            onChange(newFiles); // Nếu không chọn multiple, ghi đè ảnh cũ
          }

          e.target.value = "";
        }}
      />

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {previewUrls.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-40 w-full rounded-md border object-cover shadow-sm"
              />

              <button
                type="button"
                onClick={() => {
                  // Xóa file tương ứng tại vị trí index
                  onChange(value.filter((_, i) => i !== index));
                }}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black/90 transition-colors"
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
