import { ClipboardCheck, Pizza, Search, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { staggerDelay } from "@/components/home/stagger";
import { SectionHeading } from "@/components/home/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Search,
    title: "Find your pizza",
    text: "Search the menu or pick a category, then filter by price and location.",
  },
  {
    icon: ClipboardCheck,
    title: "Place your order",
    text: "Choose a delivery date, add your address and send the order to the shop.",
  },
  {
    icon: Pizza,
    title: "Enjoy your meal",
    text: "The shop accepts your order and brings it to your door.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="How PizzaHub Works"
          description="From craving to doorstep in three simple steps."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={staggerDelay(index)} className="h-full">
              <Card className="h-full">
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-surface-2 text-primary">
                      <Icon className="size-6" />
                    </div>
                    <span className="text-4xl font-extrabold text-primary/30" aria-hidden="true">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">
                    <span className="sr-only">Step {index + 1}: </span>
                    {title}
                  </h3>
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
