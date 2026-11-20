import Link from "next/link";
import { Beef, ChefHat, CupSoda, Leaf, Pizza, Sandwich, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { staggerDelay } from "@/components/home/stagger";
import { SectionHeading } from "@/components/home/section-heading";
import { Card } from "@/components/ui/card";
import { MENU_CATEGORIES } from "@/lib/menu";

const CATEGORY_ICONS: Record<(typeof MENU_CATEGORIES)[number], LucideIcon> = {
  "Classic Pizzas": Pizza,
  "Vegetarian Pizzas": Leaf,
  "Meat Lovers": Beef,
  "Specialty / Gourmet Pizzas": ChefHat,
  "Sides & Appetizers": Sandwich,
  "Beverages & Desserts": CupSoda,
};

export function PizzaCategories() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Pizza Categories"
          description="Know what you are craving? Jump straight to it."
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {MENU_CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <Reveal key={category} delay={staggerDelay(index)} className="h-full">
                <Link
                  href={`/menu?category=${encodeURIComponent(category)}`}
                  className="group block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Card className="h-full items-center justify-center gap-4 px-4 py-8 text-center transition group-hover:-translate-y-1 group-hover:border-primary">
                    <div className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-primary">
                      <Icon className="size-7" />
                    </div>
                    <h3 className="text-base font-semibold sm:text-lg">{category}</h3>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
