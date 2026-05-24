import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpSchema = signInSchema.extend({
  displayName: z.string().min(2).max(80).optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
