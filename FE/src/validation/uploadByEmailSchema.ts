import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const uploadByEmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .regex(emailRegex, { message: "This is not a valid email." }),
});
