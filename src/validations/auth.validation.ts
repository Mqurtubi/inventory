import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "username required"),
  email: z.email(),
  passwordHash: z.string().min(1, "password required"),
});

const loginSchema = z.object({
  email: z.email(),
  passwordHash: z.string().min(1, "password required"),
});
export { registerSchema, loginSchema };
