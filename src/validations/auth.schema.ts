import { z } from "zod";

/** Strong password for all sign-ups (v1): length + mixed character classes. */
export const strongPasswordSchema = z
  .string()
  .min(12, "min")
  .max(128)
  .refine((value) => /[a-z]/.test(value), "lower")
  .refine((value) => /[A-Z]/.test(value), "upper")
  .refine((value) => /[0-9]/.test(value), "digit")
  .refine((value) => /[^A-Za-z0-9]/.test(value), "symbol");

export const signInSchema = z.object({
  email: z.string().email(),
  /** Sign-in only checks presence; strength is enforced at sign-up. */
  password: z.string().min(1).max(128),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: strongPasswordSchema,
  displayName: z.string().min(2).max(80).optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
