import type { Metadata } from "next";
import Link from "next/link";
import { House, UtensilsCrossed } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

// This page sits outside the site layout, so it brings its own logo.
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <Link href="/" aria-label="PizzaHub home">
        <Logo iconSize={44} />
      </Link>

      <div className="space-y-3">
        <p className="text-7xl font-extrabold tracking-tight text-primary sm:text-8xl">404</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Page not found</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          The page you are looking for does not exist or may have moved. Let us get you back to
          something tasty.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">
            <House /> Back to home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/menu">
            <UtensilsCrossed /> Browse menu
          </Link>
        </Button>
      </div>
    </main>
  );
}
