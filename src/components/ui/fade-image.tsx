"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// next/image that shows a pulsing placeholder until the picture has loaded,
// then fades it in. It lazy-loads unless `priority` is set.
// Use inside a `relative` parent, together with `fill`.
export function FadeImage({ className, onLoad, priority, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-muted" />}
      <Image
        {...props}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        // A cached image can finish loading before React attaches onLoad.
        ref={(image) => {
          if (image?.complete) setLoaded(true);
        }}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={cn("transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", className)}
      />
    </>
  );
}
