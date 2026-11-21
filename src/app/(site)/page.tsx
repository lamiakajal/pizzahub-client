import { CategoryShowcase } from "@/components/home/category-showcase";
import { CraftedBanner } from "@/components/home/crafted-banner";
import { FeaturedMenu } from "@/components/home/featured-menu";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PizzaCategories } from "@/components/home/pizza-categories";
import { WhyChoose } from "@/components/home/why-choose";

// The four pizza categories shown together as "Signature Pizzas".
const SIGNATURE_CATEGORIES = [
  "Classic Pizzas",
  "Specialty / Gourmet Pizzas",
  "Meat Lovers",
  "Vegetarian Pizzas",
];

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedMenu />
      <CategoryShowcase
        title="Signature Pizzas"
        description="Classics, gourmet creations, meaty favorites and veggie delights."
        categories={SIGNATURE_CATEGORIES}
      />
      <CategoryShowcase
        title="Sides & Appetizers"
        description="Little extras that make the meal."
        categories={["Sides & Appetizers"]}
        muted
      />
      <CategoryShowcase
        title="Drinks & Desserts"
        description="Something cold or sweet to finish."
        categories={["Beverages & Desserts"]}
      />
      <PizzaCategories />
      <WhyChoose />
      <HowItWorks />
      <CraftedBanner />
    </>
  );
}
