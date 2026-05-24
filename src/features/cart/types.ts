export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  priceCents: number;
  quantity: number;
};
