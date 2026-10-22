"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const OPTIMIZED_IMAGE_HOST = "cdn.dummyjson.com";

function canOptimize(src: string): boolean {
  try {
    return new URL(src).hostname === OPTIMIZED_IMAGE_HOST;
  } catch {
    return false;
  }
}

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
}

export function ProductImage({
  src,
  alt,
  sizes,
  eager = false,
  className = "",
}: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div className="flex h-full w-full items-center justify-center text-stone-400">
        <ImageOff
          role="img"
          aria-label={alt ? `No image available for ${alt}` : "No image available"}
          strokeWidth={1.5}
          className="h-12 w-12"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      unoptimized={!canOptimize(src)}
      onError={() => setFailedSrc(src)}
      className={`object-contain ${className}`}
    />
  );
}
