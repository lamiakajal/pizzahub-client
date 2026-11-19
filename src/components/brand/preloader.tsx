"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PRELOADER_KEY } from "@/lib/preloader";

const DURATION_MS = 1000;
const FADE_MS = 350;

// Full-screen intro with a 0 to 100 counter. It runs once per browser session.
// The server renders it visible, and a small script in <head> marks repeat visits
// so CSS can hide it before the first paint (no flash on reloads).
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"running" | "leaving" | "done">("running");
  const frame = useRef(0);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(PRELOADER_KEY) === "1";
    } catch {
      // Storage can be blocked; fall through and play the intro.
    }

    if (alreadySeen) {
      frame.current = requestAnimationFrame(() => setPhase("done"));
      return () => cancelAnimationFrame(frame.current);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 300 : DURATION_MS;
    const start = performance.now();

    const tick = (now: number) => {
      const ratio = Math.min(1, (now - start) / duration);
      // Ease out, so the counter slows down near 100.
      setProgress(Math.round((1 - Math.pow(1 - ratio, 2)) * 100));

      if (ratio < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }

      try {
        sessionStorage.setItem(PRELOADER_KEY, "1");
      } catch {
        // Ignore: the intro may simply play again on the next visit.
      }
      setPhase("leaving");
      window.setTimeout(() => setPhase("done"), FADE_MS);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background"
      data-leaving={phase === "leaving" ? "true" : undefined}
      role="status"
      aria-live="polite"
      aria-label="Loading PizzaHub"
    >
      <Image
        src="/images/logo-icon.png"
        alt=""
        width={96}
        height={96}
        priority
        className="logo-icon"
      />
      <div className="w-48 space-y-3 text-center">
        <p className="text-4xl font-extrabold tracking-tight tabular-nums">
          {progress}
          <span className="text-primary">%</span>
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-action transition-[width] duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
