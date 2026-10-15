import { site } from "@/config/site";
import { reservation, telHref } from "@/config/reservation";
import { shop, shopIsPlaceholder } from "@/data/shop";

/**
 * Restaurant structured data. Address / phone are only emitted once they are
 * real, so search engines never index placeholder values.
 */
export default function JsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    description: site.description,
    url: site.url,
    servesCuisine: ["焼肉", "Yakiniku"],
    priceRange: `${site.budget.price}${site.budget.suffix}`,
  };
  if (!shopIsPlaceholder) data.address = shop.address;
  if (reservation.phone && telHref(reservation.phone)) data.telephone = reservation.phone;
  if (/^https?:\/\//.test(reservation.webUrl)) data.acceptsReservations = reservation.webUrl;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
