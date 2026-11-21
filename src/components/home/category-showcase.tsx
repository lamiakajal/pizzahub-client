import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { staggerDelay } from "@/components/home/stagger";
import { MenuCard } from "@/components/menu/menu-card";
import { apiGet } from "@/lib/api";
import type { MenuItem } from "@/lib/menu";
import { cn } from "@/lib/utils";

const ITEMS_PER_CATEGORY = 3;

function categoryHref(category: string) {
  return `/menu?category=${encodeURIComponent(category)}`;
}

function ViewAll({ category }: { category: string }) {
  return (
    <Link
      href={categoryHref(category)}
      className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap text-primary hover:underline"
    >
      View all <ArrowRight className="size-4" />
    </Link>
  );
}

// One request per category. A failed request just hides that category,
// so a slow or unavailable API never breaks the home page.
async function loadCategory(category: string) {
  try {
    const { data } = await apiGet<MenuItem[]>("/api/menu-items", {
      category,
      sort: "featured",
      limit: ITEMS_PER_CATEGORY,
    });
    return { category, items: data };
  } catch {
    return { category, items: [] as MenuItem[] };
  }
}

// A home page section for one or more menu categories.
// Categories without approved items are left out.
export async function CategoryShowcase({
  title,
  description,
  categories,
  muted = false,
}: {
  title: string;
  description: string;
  categories: string[];
  muted?: boolean;
}) {
  const groups = (await Promise.all(categories.map(loadCategory))).filter(
    (group) => group.items.length > 0
  );

  if (groups.length === 0) return null;

  // With a single category the section heading carries the "View all" link.
  const single = categories.length === 1;

  return (
    <section className={cn("py-16 sm:py-20", muted && "border-y border-border bg-surface")}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={title}
          description={description}
          action={single ? <ViewAll category={categories[0]} /> : undefined}
        />

        <div className="space-y-12">
          {groups.map(({ category, items }) => (
            <div key={category}>
              {!single && (
                <Reveal className="mb-6 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold">{category}</h3>
                  <ViewAll category={category} />
                </Reveal>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <Reveal key={item._id} delay={staggerDelay(index)} className="h-full">
                    <MenuCard item={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
