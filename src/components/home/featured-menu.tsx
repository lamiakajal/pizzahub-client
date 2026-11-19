import Link from "next/link";
import { ArrowRight, TriangleAlert, UtensilsCrossed } from "lucide-react";
import { Reveal, staggerDelay } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { MenuCard } from "@/components/menu/menu-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiGet } from "@/lib/api";
import type { MenuItem } from "@/lib/menu";

async function loadFeatured() {
  try {
    const { data } = await apiGet<MenuItem[]>("/api/menu-items", { sort: "featured", limit: 6 });
    return { items: data, failed: false };
  } catch {
    // The home page must still render when the API is down.
    return { items: [] as MenuItem[], failed: true };
  }
}

export async function FeaturedMenu() {
  const { items, failed } = await loadFeatured();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Menu Items"
          description="Fresh picks from our local pizza shops. Premium vendors are shown first."
          action={
            <Button asChild variant="outline">
              <Link href="/menu">
                View all <ArrowRight />
              </Link>
            </Button>
          }
        />

        {failed ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <TriangleAlert className="size-10 text-error" />
              <p className="max-w-sm text-sm text-muted-foreground">
                We could not load the menu right now. Please try again in a moment.
              </p>
              <Button asChild variant="outline">
                <Link href="/">Try again</Link>
              </Button>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <UtensilsCrossed className="size-10 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No menu items yet</h3>
              <p className="text-sm text-muted-foreground">
                New dishes from local shops will show up here soon.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <Reveal key={item._id} delay={staggerDelay(index)} className="h-full">
                <MenuCard item={item} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
