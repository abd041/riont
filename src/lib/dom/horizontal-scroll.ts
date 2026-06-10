/** Normalized horizontal scroll progress (0–1), RTL-safe across browsers. */
export function getHorizontalScrollProgress(element: HTMLElement): number {
  const maxScroll = element.scrollWidth - element.clientWidth;
  if (maxScroll <= 0) return 0;

  const isRtl = getComputedStyle(element).direction === "rtl";
  const { scrollLeft } = element;

  if (!isRtl) {
    return scrollLeft / maxScroll;
  }

  if (scrollLeft < 0) {
    return Math.min(1, Math.abs(scrollLeft) / maxScroll);
  }

  return (maxScroll - scrollLeft) / maxScroll;
}

/** Scroll a horizontal container to a normalized position (0–1). */
export function scrollToHorizontalProgress(
  element: HTMLElement,
  progress: number,
  behavior: ScrollBehavior = "smooth",
): void {
  const maxScroll = element.scrollWidth - element.clientWidth;
  if (maxScroll <= 0) return;

  const clamped = Math.max(0, Math.min(1, progress));
  const offset = clamped * maxScroll;
  const isRtl = getComputedStyle(element).direction === "rtl";

  if (!isRtl) {
    element.scrollTo({ left: offset, behavior });
    return;
  }

  element.scrollTo({ left: -offset, behavior });
}
