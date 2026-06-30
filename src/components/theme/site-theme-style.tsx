import { getSiteAppearance } from "@/server/services/theme.service";

export async function SiteThemeStyle() {
  const { themeCss } = await getSiteAppearance();

  return (
    <style
      id="riyont-theme-variables"
      dangerouslySetInnerHTML={{ __html: themeCss }}
    />
  );
}
