export function SiteThemeStyle({ themeCss }: { themeCss: string }) {
  return (
    <style
      id="riyont-theme-variables"
      dangerouslySetInnerHTML={{ __html: themeCss }}
    />
  );
}
