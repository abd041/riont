import { notFound } from "next/navigation";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { getProductForCheckout } from "@/server/services/product.service";
import { getPaymentInstructions } from "@/server/services/site-settings.service";
import { getSession } from "@/server/services/auth.service";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { slug, locale } = await params;
  const { variant: variantId } = await searchParams;
  const product = await getProductForCheckout(locale, slug, variantId);
  const user = await getSession();

  if (!product) notFound();

  const paymentInstructions = await getPaymentInstructions(locale);

  return (
    <CheckoutForm
      product={product}
      locale={locale}
      paymentInstructions={paymentInstructions}
      isLoggedIn={Boolean(user)}
      userEmail={user?.email}
    />
  );
}
