import { Bike, Flame, MousePointerClick, ShieldCheck, Store, Tag, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { staggerDelay } from "@/components/home/stagger";
import { SectionHeading } from "@/components/home/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const BENEFITS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Store,
    title: "Local pizza shops",
    text: "Order from restaurants in your area and support the shops you already love.",
  },
  {
    icon: Bike,
    title: "Fast delivery",
    text: "Pick your delivery date and address, and the shop takes it from there.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewed menus",
    text: "Every dish is checked by our team before it shows up on the menu.",
  },
  {
    icon: MousePointerClick,
    title: "Simple ordering",
    text: "Find a dish, send your order in a few taps and follow its status.",
  },
  {
    icon: Flame,
    title: "Hot and fresh",
    text: "Pizzas are made when you order, so they arrive the way they should.",
  },
  {
    icon: Tag,
    title: "Clear prices",
    text: "See the price of every item up front, with no surprises later.",
  },
];

export function WhyChoose() {
  return (
    <section className="bg-surface-2 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why Choose PizzaHub?"
          description="Everything you need to get good pizza, without the hassle."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={staggerDelay(index)} className="h-full">
              <Card className="h-full">
                <CardContent className="space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-surface-2 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
