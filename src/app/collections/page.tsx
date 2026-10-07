import type { Metadata } from "next";
import { getCollections } from "@/lib/data";
import { isLabelCollectionSlug } from "@/lib/label-collections";
import { CatalogueIndex } from "@/components/discovery";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description: `Explore curated collections at ${siteConfig.name}.`,
};

export default async function CollectionsIndexPage() {
  const collections = await getCollections();
  // Index is editorial MerchCollections only — never New Arrivals / Best Sellers.
  const editorial = collections.filter((c) => !isLabelCollectionSlug(c.slug));

  return (
    <CatalogueIndex
      eyebrow="Shop"
      title="Collections"
      description="Curated edits and merchandising collections — aesthetic-led entry points into the catalogue."
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Collections" },
      ]}
      items={editorial.map((c) => ({
        id: c.id,
        name: c.name,
        href: c.href,
        image: c.image,
        description: c.description,
      }))}
    />
  );
}
