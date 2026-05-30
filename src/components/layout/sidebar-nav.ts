export type NavMatch =
  | "never"
  | "path"
  | "path-prefix"
  | "products-root"
  | "products-category";

export type NavItemConfig = {
  href: string;
  key: string;
  exact?: boolean;
  match?: NavMatch;
  categorySlug?: string;
};

export function isNavActive(
  pathname: string,
  searchParams: URLSearchParams,
  item: NavItemConfig,
): boolean {
  if (item.exact) {
    return pathname === "/" || pathname === "";
  }

  const match = item.match ?? "path";

  if (match === "never") {
    return false;
  }

  if (match === "products-root") {
    return pathname === "/products" && !searchParams.get("category");
  }

  if (match === "products-category" && item.categorySlug) {
    return (
      pathname === "/products" &&
      searchParams.get("category") === item.categorySlug
    );
  }

  if (match === "path-prefix") {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  if (match === "path") {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
