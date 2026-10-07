import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCollectionBySlug,
  getCollectionPriceBounds,
  getProductsByCollection,
} from "@/lib/data";
import {
  hasActiveFilters,
  parseDiscoveryQuery,
} from "@/lib/discovery";
import { ProductDiscovery } from "@/components/discovery";
import { siteConfig } from "@/config/site";

const SLUG = "best-sellers";
const HREF = "/best-sellers";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const collection = await getCollectionBySlug(SLUG);
  if (!collection) return { title: "Bestsellers" };
  return {
    title: collection.seoTitle || collection.name,
    description:
      collection.seoDescription ||
      collection.description ||
      `Shop ${collection.name} at ${siteConfig.name}.`,
  };
}

/**
 * Operational Best Sellers PLP — same ranking as before (salesCount / featured fallback).
 * Reuses getProductsByCollection / label-collections; does not change ranking rules.
 */
export default async function BestSellersPage({ searchParams }: PageProps) {
  const collection = await getCollectionBySlug(SLUG);
  if (!collection) notFound();

  const query = parseDiscoveryQuery(await searchParams);
  const [page, priceBounds] = await Promise.all([
    getProductsByCollection(SLUG, query),
    getCollectionPriceBounds(SLUG, query),
  ]);
  const filtered = hasActiveFilters(query);

  return (
    <ProductDiscovery
      eyebrow="Shop"
      title={collection.name}
      description={collection.description}
      crumbs={[
        { label: "Home", href: "/" },
        { label: collection.name },
      ]}
      products={page.products}
      totalCount={page.totalCount}
      totalPages={page.totalPages}
      currentPage={page.currentPage}
      query={query}
      priceBounds={priceBounds}
      filterMode="taxonomy"
      resetHref={HREF}
      empty={{
        title: filtered
          ? "No products match these filters"
          : `No products in ${collection.name} yet`,
        description: filtered
          ? "Try clearing filters or adjusting sort to see more."
          : "Bestsellers are being prepared — explore the full catalogue in the meantime.",
        action: filtered
          ? { label: "Clear filters", href: HREF }
          : { label: "Shop all", href: "/shop" },
      }}
    />
  );
}
