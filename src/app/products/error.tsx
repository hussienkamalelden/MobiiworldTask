"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

interface ProductsErrorProps {
  error: unknown;
  retry: () => void;
}

export default function ProductsError({ error, retry }: ProductsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Something went wrong"
      description="We could not load the products right now. Please check your connection and try again."
      action={<Button onClick={retry}>Try again</Button>}
    />
  );
}
