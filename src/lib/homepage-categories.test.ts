import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("storefront uses dedicated homepage categories helper for showcase only", () => {
  const dataSrc = fs.readFileSync(
    path.join(import.meta.dirname, "data.ts"),
    "utf8",
  );
  const apiSrc = fs.readFileSync(
    path.join(import.meta.dirname, "api/categories.ts"),
    "utf8",
  );
  const showcaseSrc = fs.readFileSync(
    path.join(import.meta.dirname, "../components/home/category-showcase.tsx"),
    "utf8",
  );
  const categoriesPageSrc = fs.readFileSync(
    path.join(import.meta.dirname, "../app/categories/page.tsx"),
    "utf8",
  );

  assert.match(apiSrc, /fetchPublicHomepageCategories/);
  assert.match(apiSrc, /\/api\/categories\?home=true/);
  assert.match(dataSrc, /export async function getHomepageCategories/);
  assert.match(dataSrc, /fetchPublicHomepageCategories/);
  assert.match(
    dataSrc,
    /export async function getCategories[\s\S]*?fetchPublicCategories/,
  );

  assert.match(showcaseSrc, /import \{ getHomepageCategories \} from "@\/lib\/data"/);
  assert.match(showcaseSrc, /await getHomepageCategories\(\)/);
  assert.doesNotMatch(showcaseSrc, /import \{[^}]*getCategories[^}]*\} from "@\/lib\/data"/);
  assert.doesNotMatch(showcaseSrc, /await getCategories\(\)/);

  // Full catalogue index must keep using getCategories (not homepage helper).
  assert.match(categoriesPageSrc, /getCategories/);
  assert.doesNotMatch(categoriesPageSrc, /getHomepageCategories/);
});

test("category showcase mobile swipe layout classes remain unchanged", () => {
  const showcaseSrc = fs.readFileSync(
    path.join(import.meta.dirname, "../components/home/category-showcase.tsx"),
    "utf8",
  );
  assert.match(
    showcaseSrc,
    /no-scrollbar grid snap-x snap-mandatory grid-flow-col auto-cols-\[46%\] gap-4 overflow-x-auto pb-1 sm:auto-cols-\[40%\] md:grid-flow-row md:grid-cols-4 md:gap-6 md:snap-none md:overflow-visible md:pb-0/,
  );
});
