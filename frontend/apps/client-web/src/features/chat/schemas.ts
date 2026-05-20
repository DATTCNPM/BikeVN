import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const sendMessageSchema = z
  .object({
    content: z.string().optional(),
    image: z
      .instanceof(File)
      .optional()
      .nullable()
      .refine(
        (file) => !file || file.size <= MAX_IMAGE_SIZE,
        "Kích thước ảnh tối đa là 5MB",
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Chỉ hỗ trợ định dạng .jpg, .jpeg, .png, .webp",
      ),
  })
  .refine((data) => data.content || data.image, {
    message: "Phải nhập tin nhắn hoặc gửi ảnh",
    path: ["content"],
  });

export type SendMessagePayload = z.infer<typeof sendMessageSchema>;
