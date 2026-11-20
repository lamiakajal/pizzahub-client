import { PizzaLoader } from "@/components/brand/pizza-loader";

// Shown inside the dashboard shell, so the sidebar stays put while a page loads.
export default function DashboardLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <PizzaLoader size="lg" label="Loading" />
    </div>
  );
}
