import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(2, { message: "Message must be atleast 2 characters long" })
    .max(1000, { message: "Message must be atmost 1000 characters long" }),
});
