import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
        Hot &amp; Fresh Pizza Delivered to Your Door
      </h1>
      <p className="max-w-md text-muted-foreground">
        Discover local pizza shops, browse their menus and order your favorite
        pizza. The full home page is on its way.
      </p>
      <Button asChild size="lg">
        <Link href="/menu">Explore Pizza Menu</Link>
      </Button>
    </section>
  );
}
