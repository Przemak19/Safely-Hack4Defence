import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const photoUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "You need to choose file." })
    .refine((file) => file.type.startsWith("image/"), {
      message: " Only JPG, PNG, WEBP files are allowed.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File is too big. Maximum size is 10MB",
    }),
});
