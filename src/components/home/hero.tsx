"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HERO_SLIDES } from "@/components/home/hero-slides";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;
const COUNT = HERO_SLIDES.length;

// The hero always sits on a dark photo, so its text is white in both themes.
export function Hero() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const goTo = (index: number) => setActive((index + COUNT) % COUNT);

  // Auto-advance. Restarts after every change, so a manual click gets a full pause.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = window.setTimeout(
      () => setActive((index) => (index + 1) % COUNT),
      AUTOPLAY_MS
    );
    return () => window.clearTimeout(timer);
  }, [active, paused, reduceMotion]);

  // Keep the active thumbnail centered inside the strip without scrolling the page.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[active];
    if (!strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [active, reduceMotion]);

  return (
    <section
      aria-label="Welcome to PizzaHub"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-black text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background photos stay mounted and cross-fade, so switching is instant. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => (
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: index === active ? 1 : 0,
              scale: reduceMotion || index === active ? 1 : 1.05,
            }}
            transition={{ duration: reduceMotion ? 0 : 1, ease: "easeInOut" }}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-[78%_50%]"
            />
          </motion.div>
        ))}
        {/* Dark fade keeps the text readable over any photo. */}
        <div className="absolute inset-0 bg-black/50 md:hidden" />
        <div className="absolute inset-0 hidden bg-linear-to-r from-black/90 via-black/55 to-transparent md:block" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-32 pb-10 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl space-y-6"
        >
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Hot &amp; Fresh Pizza Delivered to Your Door
          </h1>
          <p className="max-w-xl text-base text-white/80 sm:text-lg">
            Discover local pizza shops, browse their menus and order your
            favorite pizza in a few taps. Hot, fresh and always delicious.
          </p>
          <Button asChild size="lg" className="h-12 px-7 text-base">
            <Link href="/menu">Explore Pizza Menu</Link>
          </Button>
        </motion.div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 pb-8 sm:px-6 lg:px-8">
        <div
          ref={stripRef}
          className="relative flex flex-1 gap-3 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              ref={(element) => {
                thumbRefs.current[index] = element;
              }}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show photo ${index + 1}: ${slide.alt}`}
              aria-current={index === active}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-black transition sm:h-24 sm:w-36 lg:h-28 lg:w-44",
                index === active
                  ? "border-action"
                  : "border-white/25 opacity-80 hover:border-white/60 hover:opacity-100"
              )}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 176px, (min-width: 640px) 144px, 96px"
                className="object-cover object-[80%_50%]"
              />
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => goTo(active - 1)}
            aria-label="Previous photo"
          >
            <ArrowLeft />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => goTo(active + 1)}
            aria-label="Next photo"
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
