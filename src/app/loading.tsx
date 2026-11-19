import { PizzaLoader } from "@/components/brand/pizza-loader";

// Shown while a page loads during navigation.
export default function RootLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <PizzaLoader size="lg" label="Heating up the oven" />
    </div>
  );
}
