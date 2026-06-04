import Link from "next/link";

export function AdminProductCreatedBanner({
  productName,
  deliveryMode,
}: {
  productName: string;
  deliveryMode: "auto" | "manual";
}) {
  return (
    <div className="admin-banner admin-banner--success" role="status">
      <p className="admin-banner__title">Product created — {productName}</p>
      <p className="admin-banner__text">
        {deliveryMode === "auto"
          ? "Next: scroll down and add stock (codes or keys) so automatic delivery can work."
          : "Next: when orders arrive, open each order and paste delivery details for the customer."}
      </p>
      <p className="admin-banner__text">
        <Link href="/en/products" className="admin-banner__link">
          View storefront
        </Link>
        {" · "}
        Product stays hidden until you set visibility to Live.
      </p>
    </div>
  );
}
