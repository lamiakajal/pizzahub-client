import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/home/reveal";
import { Button } from "@/components/ui/button";

const PHOTOS = [
  {
    src: "/images/home/oven-fire.jpg",
    alt: "Pizza baking beside glowing embers in a wood-fired oven",
    label: "Fired in stone ovens",
  },
  {
    src: "/images/home/cheese-pull.jpg",
    alt: "A slice of pizza lifted with stretching melted cheese",
    label: "Melty and fresh",
  },
  {
    src: "/images/home/neon-slice.jpg",
    alt: "Neon pizza slice sign hanging outside a restaurant",
    label: "Local favorites",
  },
  {
    src: "/images/home/dinner-table.jpg",
    alt: "Friends sharing pizza at a candlelit table",
    label: "Made for sharing",
  },
];

// Closing call to action above the footer.
export function CraftedBanner() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-surface lg:grid-cols-2">
          <Reveal className="flex flex-col justify-center gap-6 p-8 sm:p-12">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Partner with PizzaHub
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Crafted Fresh, Delivered Hot
            </h2>
            <p className="max-w-md text-muted-foreground sm:text-lg">
              Every pizza starts with fresh dough and real fire, then travels from a local
              kitchen to your door while it is still steaming. Own a pizza shop? Put your
              menu in front of hungry neighbors.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/menu">Explore Pizza Menu</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-up">Become a Vendor</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-3">
            {PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted lg:aspect-square"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 300px, 45vw"
                  className="object-cover"
                />
                {/* The photos are dark, so white text on a dark fade is readable in both themes. */}
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-3 pt-8 pb-2.5 text-xs font-semibold text-white">
                  {photo.label}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
