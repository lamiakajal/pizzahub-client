"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Large image with clickable thumbnails for items that have several photos.
export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-4/3 w-full rounded-2xl bg-muted" />;
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-4/3 overflow-hidden rounded-lg border-2 bg-muted transition",
                index === active ? "border-action" : "border-border opacity-80 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill sizes="150px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
