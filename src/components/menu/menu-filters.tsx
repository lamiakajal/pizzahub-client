"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

const FILTER_KEYS = ["search", "category", "location", "sort", "minPrice", "maxPrice"] as const;

// Search, filters and sorting live in the URL, so results can be shared and bookmarked.
export function MenuFilters({
  categories,
  locations,
}: {
  categories: string[];
  locations: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function apply(form: HTMLFormElement) {
    const data = new FormData(form);
    const next = new URLSearchParams();

    for (const key of FILTER_KEYS) {
      const value = String(data.get(key) ?? "").trim();
      if (value) next.set(key, value);
    }

    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const hasFilters = FILTER_KEYS.some((key) => params.get(key));

  return (
    // Remounting on URL change keeps the inputs in sync after Reset or back/forward.
    <form
      key={params.toString()}
      onSubmit={(event) => {
        event.preventDefault();
        apply(event.currentTarget);
      }}
      className="space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={params.get("search") ?? ""}
            placeholder="Search pizzas, sides and drinks"
            className="pl-9"
            aria-label="Search menu"
          />
        </div>
        <Button type="submit">Search</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <NativeSelect
          name="category"
          aria-label="Filter by category"
          defaultValue={params.get("category") ?? ""}
          onChange={(event) => event.currentTarget.form && apply(event.currentTarget.form)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </NativeSelect>

        <NativeSelect
          name="location"
          aria-label="Filter by location"
          defaultValue={params.get("location") ?? ""}
          onChange={(event) => event.currentTarget.form && apply(event.currentTarget.form)}
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </NativeSelect>

        <NativeSelect
          name="sort"
          aria-label="Sort results"
          defaultValue={params.get("sort") ?? ""}
          onChange={(event) => event.currentTarget.form && apply(event.currentTarget.form)}
        >
          <option value="">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </NativeSelect>

        <Input
          name="minPrice"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          defaultValue={params.get("minPrice") ?? ""}
          placeholder="Min price"
          aria-label="Minimum price"
        />
        <Input
          name="maxPrice"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          defaultValue={params.get("maxPrice") ?? ""}
          placeholder="Max price"
          aria-label="Maximum price"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Press Enter in a price box or Search to apply price limits.
        </p>
        {hasFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={() => router.push(pathname)}>
            <RotateCcw /> Reset
          </Button>
        )}
      </div>
    </form>
  );
}
