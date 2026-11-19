import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function pageHref(basePath: string, params: Record<string, string>, page: number) {
  const next = new URLSearchParams(params);
  if (page > 1) next.set("page", String(page));
  else next.delete("page");
  const query = next.toString();
  return query ? `${basePath}?${query}` : basePath;
}

// Link-based pagination: works without JavaScript and keeps current filters.
export function PaginationLinks({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={pageHref(basePath, params, page - 1)}>
            <ChevronLeft /> Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft /> Previous
        </Button>
      )}

      {pages.map((number) => (
        <Link
          key={number}
          href={pageHref(basePath, params, number)}
          aria-current={number === page ? "page" : undefined}
          className={cn(
            "flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
            number === page
              ? "border-primary bg-primary text-on-primary"
              : "border-border bg-surface hover:bg-surface-2"
          )}
        >
          {number}
        </Link>
      ))}

      {page < totalPages ? (
        <Button asChild variant="outline" size="sm">
          <Link href={pageHref(basePath, params, page + 1)}>
            Next <ChevronRight />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next <ChevronRight />
        </Button>
      )}
    </nav>
  );
}
