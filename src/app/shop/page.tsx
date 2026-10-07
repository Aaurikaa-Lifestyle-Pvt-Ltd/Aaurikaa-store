import type { Metadata } from "next";
import {
  getMegaMenuTree,
  getSearchPriceBounds,
  searchProducts,
} from "@/lib/data";
import {
  hasActiveFilters,
  parseDiscoveryQuery,
} from "@/lib/discovery";
import { ProductDiscovery } from "@/components/discovery";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: "Shop",
  description: `Browse the complete ${siteConfig.name} jewellery catalogue.`,
};

/**
 * Full-catalogue PLP — reuses ProductDiscovery + searchProducts without requiring `q`.
 * Does not replace /search (search still requires a term).
 */
export default async function ShopPage({ searchParams }: PageProps) {
  const query = parseDiscoveryQuery(await searchParams);
  const filtered = hasActiveFilters(query);
  const megaMenu = await getMegaMenuTree();

  const [page, priceBounds] = await Promise.all([
    searchProducts(query, megaMenu),
    getSearchPriceBounds(query, megaMenu),
  ]);

  const resetHref = "/shop";

  return (
    <ProductDiscovery
      eyebrow="Shop"
      title="All jewellery"
      description={`Explore the complete ${siteConfig.name} catalogue.`}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Shop" },
      ]}
      products={page.products}
      totalCount={page.totalCount}
      totalPages={page.totalPages}
      currentPage={page.currentPage}
      query={query}
      priceBounds={priceBounds}
      taxonomyOptions={megaMenu}
      filterMode="search"
      resetHref={resetHref}
      empty={{
        title: filtered
          ? "No products match these filters"
          : "No products available yet",
        description: filtered
          ? "Try clearing filters or adjusting sort to see more of the catalogue."
          : "New pieces are being prepared — check back soon.",
        action: filtered
          ? { label: "Clear filters", href: resetHref }
          : { label: "Browse categories", href: "/categories" },
      }}
    />
  );
}
