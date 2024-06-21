import { z } from "zod";

export const verifySchema = z.object({
  code: z
    .string()
    .min(6, { message: "Code should be atleast 6 characters long." })
    .max(6, { message: "Code should be atmost 6 characters long." }),
});
