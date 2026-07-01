import { z } from "zod";
import { HERO_SLIDE_IDS } from "@/lib/site/hero-slides";

const localeCopySchema = z.object({
  title: z.string().max(120).optional(),
  highlight: z.string().max(120).optional(),
  subtitle: z.string().max(300).optional(),
  tag: z.string().max(60).optional(),
});

const slideEntrySchema = z.object({
  en: localeCopySchema.optional(),
  ar: localeCopySchema.optional(),
});

const slideIdSchema = z.enum(HERO_SLIDE_IDS);

export const saveHeroSlideContentSchema = z.object({
  slides: z.record(slideIdSchema, slideEntrySchema),
});

export type SaveHeroSlideContentInput = z.infer<
  typeof saveHeroSlideContentSchema
>;
