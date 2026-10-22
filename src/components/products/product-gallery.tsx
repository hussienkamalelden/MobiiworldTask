"use client";

import { useState } from "react";
import { ProductImage } from "./product-image";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasSwitched, setHasSwitched] = useState(false);
  const activeImage = images[activeIndex] ?? "";

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-media">
        <ProductImage
          key={activeImage}
          src={activeImage}
          alt={title}
          sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 80vw"
          eager
          className={`p-8 sm:p-12 ${hasSwitched ? "animate-fade-in" : ""}`}
        />
      </div>

      {images.length > 1 && (
        <ul aria-label="Product images" className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={image}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    setHasSwitched(true);
                  }}
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                  aria-pressed={isActive}
                  className={`relative block aspect-square w-full overflow-hidden rounded-xl border-2 bg-media transition-colors ${
                    isActive ? "border-accent" : "border-transparent hover:border-accent-line"
                  }`}
                >
                  <ProductImage src={image} alt="" sizes="96px" className="p-2" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
