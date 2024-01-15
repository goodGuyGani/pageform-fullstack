import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export type createUserSchemaType = z.infer<typeof createUserSchema>;
