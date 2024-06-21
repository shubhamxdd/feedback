import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(1, "Username should be atleast 1 character long.")
  .max(20, "Username should be atmost 20 characters long.")
  .regex(/^[a-zA-Z0-9]+$/, "Username must not contain special characters.");

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(2, { message: "Password should be atleast 2 characters long." })
    .max(20, { message: "Password should be atmost 20 characters long." }),
});
