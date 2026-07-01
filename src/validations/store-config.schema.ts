import { z } from "zod";

const urlOrMailto = z
  .string()
  .max(500)
  .refine(
    (v) =>
      !v.trim() ||
      v.startsWith("http://") ||
      v.startsWith("https://") ||
      v.startsWith("mailto:"),
    "Use a full URL or mailto: link",
  );

export const saveStoreFeaturesSchema = z
  .object({
    heroAutoplay: z.coerce.boolean(),
    floatingWhatsappEnabled: z.coerce.boolean(),
    maintenanceMode: z.coerce.boolean(),
    maintenanceMessageEn: z.string().max(500).optional(),
    maintenanceMessageAr: z.string().max(500).optional(),
    showFooterSocial: z.coerce.boolean(),
    showFooterNewsletter: z.coerce.boolean(),
    twitter: urlOrMailto.optional(),
    discord: urlOrMailto.optional(),
    instagram: urlOrMailto.optional(),
    email: urlOrMailto.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.maintenanceMode) return;
    const hasMessage =
      !!data.maintenanceMessageEn?.trim() || !!data.maintenanceMessageAr?.trim();
    if (!hasMessage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a maintenance message in at least one language",
        path: ["maintenanceMessageEn"],
      });
    }
  });
