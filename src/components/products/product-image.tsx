import { ImageOff } from "lucide-react";
import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: ProductImageProps) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center text-stone-300">
        <ImageOff
          role="img"
          aria-label={`No image available for ${alt}`}
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
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
