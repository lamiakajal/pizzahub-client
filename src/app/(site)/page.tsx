import { FeaturedMenu } from "@/components/home/featured-menu";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PizzaCategories } from "@/components/home/pizza-categories";
import { WhyChoose } from "@/components/home/why-choose";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedMenu />
      <PizzaCategories />
      <WhyChoose />
      <HowItWorks />
    </>
  );
}
