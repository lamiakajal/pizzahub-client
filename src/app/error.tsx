"use client";

import Link from "next/link";
import { House, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-error/10 text-error">
        <TriangleAlert className="size-8" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Something went wrong</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          An unexpected error stopped this page from loading. You can try again, or head back to
          the home page.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          <RotateCcw /> Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <House /> Back to home
          </Link>
        </Button>
      </div>
    </main>
  );
}
