"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_PRODUCT_CHANGES } from "@/lib/product-changes";
import type { ProductChanges } from "@/lib/product-changes";
import {
  getProductChanges,
  subscribeToProductChanges,
} from "@/services/local-product-store";

export function useProductChanges(): ProductChanges {
  return useSyncExternalStore(
    subscribeToProductChanges,
    getProductChanges,
    () => EMPTY_PRODUCT_CHANGES,
  );
}
