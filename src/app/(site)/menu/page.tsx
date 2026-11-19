import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, TriangleAlert } from "lucide-react";
import { MenuCard } from "@/components/menu/menu-card";
import { MenuFilters } from "@/components/menu/menu-filters";
import { PaginationLinks } from "@/components/menu/pagination-links";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiGet, type PageMeta } from "@/lib/api";
import { MENU_CATEGORIES, type MenuItem } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Browse Menu",
  description: "Search pizzas, sides and drinks from local pizza shops.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const KEYS = ["search", "category", "location", "sort", "minPrice", "maxPrice", "page"] as const;

export default async function MenuPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;

  // Keep only known keys, as single strings.
  const params: Record<string, string> = {};
  for (const key of KEYS) {
    const value = Array.isArray(raw[key]) ? raw[key][0] : raw[key];
    if (value) params[key] = value;
  }
  const { page: _page, ...filterParams } = params;

  let items: MenuItem[] = [];
  let meta: PageMeta | undefined;
  let locations: string[] = [];
  let errorMessage: string | null = null;

  try {
    const [list, filters] = await Promise.all([
      apiGet<MenuItem[]>("/api/menu-items", params),
      apiGet<{ categories: string[]; locations: string[] }>("/api/menu-items/filters"),
    ]);
    items = list.data;
    meta = list.meta;
    locations = filters.data.locations;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Could not load the menu";
  }

  return (
    <section className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Browse Menu</h1>
        <p className="text-muted-foreground">
          Hot pizzas, tasty sides and cold drinks from local shops near you.
        </p>
      </div>

      <MenuFilters categories={[...MENU_CATEGORIES]} locations={locations} />

      <div className="mt-8">
        {errorMessage ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <TriangleAlert className="size-10 text-error" />
              <h2 className="text-lg font-semibold">We could not load the menu</h2>
              <p className="max-w-sm text-sm text-muted-foreground">{errorMessage}</p>
              <Button asChild variant="outline">
                <Link href="/menu">Try again</Link>
              </Button>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <SearchX className="size-10 text-muted-foreground" />
              <h2 className="text-lg font-semibold">No menu items found</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try a different search or remove some filters.
              </p>
              <Button asChild variant="outline">
                <Link href="/menu">Clear all filters</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Showing {items.length} of {meta?.total ?? items.length} items
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <MenuCard key={item._id} item={item} priority={index < 3} />
              ))}
            </div>
            <PaginationLinks
              page={meta?.page ?? 1}
              totalPages={meta?.totalPages ?? 1}
              basePath="/menu"
              params={filterParams}
            />
          </>
        )}
      </div>
    </section>
  );
}
