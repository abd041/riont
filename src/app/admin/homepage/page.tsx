import { listAdminHomepageBlocks } from "@/server/services/content-block.service";
import { AdminHomepageForm } from "@/features/admin/components/admin-homepage-form";
import type { HeroBlockContent, TrustBlockContent } from "@/server/services/content-block.service";

function pickBlock<T>(
  blocks: Awaited<ReturnType<typeof listAdminHomepageBlocks>>,
  blockKey: string,
  locale: string,
  parse: (content: Record<string, unknown>) => T | null,
): T | null {
  const row = blocks.find((b) => b.blockKey === blockKey && b.locale === locale);
  if (!row) return null;
  return parse(row.content);
}

function parseHero(content: Record<string, unknown>): HeroBlockContent | null {
  if (typeof content.title !== "string") return null;
  return {
    title: content.title,
    highlight: typeof content.highlight === "string" ? content.highlight : "",
    subtitle: typeof content.subtitle === "string" ? content.subtitle : "",
    primaryLabel:
      typeof content.primaryLabel === "string" ? content.primaryLabel : "",
    primaryHref:
      typeof content.primaryHref === "string" ? content.primaryHref : "/products",
    secondaryLabel:
      typeof content.secondaryLabel === "string" ? content.secondaryLabel : "",
    secondaryHref:
      typeof content.secondaryHref === "string"
        ? content.secondaryHref
        : "/categories",
  };
}

function parseTrust(content: Record<string, unknown>): TrustBlockContent | null {
  const raw = content.items;
  if (!Array.isArray(raw)) return null;
  const items = raw
    .map((item) => {
      if (typeof item === "object" && item && "label" in item) {
        const label = (item as { label: unknown }).label;
        if (typeof label === "string") return { label };
      }
      return null;
    })
    .filter((item): item is { label: string } => item !== null);
  return items.length ? { items } : null;
}

export default async function AdminHomepagePage() {
  const blocks = await listAdminHomepageBlocks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Homepage content</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Edit hero and trust bar copy per language. Empty fields fall back to
          default translations until you save.
        </p>
      </div>
      <AdminHomepageForm
        blocks={{
          enHero: pickBlock(blocks, "home_hero", "en", parseHero),
          arHero: pickBlock(blocks, "home_hero", "ar", parseHero),
          enTrust: pickBlock(blocks, "home_trust", "en", parseTrust),
          arTrust: pickBlock(blocks, "home_trust", "ar", parseTrust),
        }}
      />
    </div>
  );
}
