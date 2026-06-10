export const CART_ITEM_ADDED_EVENT = "cart:item-added";

export function notifyCartItemAdded(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_ITEM_ADDED_EVENT));
}
