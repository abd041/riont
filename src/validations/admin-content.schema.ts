import { z } from "zod";

export const saveHeroBlockSchema = z.object({
  locale: z.enum(["en", "ar"]),
  title: z.string().min(1).max(200),
  highlight: z.string().max(120).optional(),
  subtitle: z.string().max(500).optional(),
  primaryLabel: z.string().max(80).optional(),
  primaryHref: z.string().max(200).optional(),
  secondaryLabel: z.string().max(80).optional(),
  secondaryHref: z.string().max(200).optional(),
});

export const saveTrustBlockSchema = z.object({
  locale: z.enum(["en", "ar"]),
  item1: z.string().min(1).max(120),
  item2: z.string().min(1).max(120),
  item3: z.string().min(1).max(120),
  item4: z.string().min(1).max(120),
  item5: z.string().max(120).optional(),
});
