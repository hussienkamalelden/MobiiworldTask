import { EMPTY_PRODUCT_CHANGES, countProductChanges } from "@/lib/product-changes";
import type { DeletedProductSnapshot, ProductChanges } from "@/lib/product-changes";
import { isLocalProductId } from "@/lib/product";
import type { Product } from "@/types/product";

const STORAGE_KEY = "product-changes";

const listeners = new Set<() => void>();
let cachedChanges: ProductChanges | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStoredProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number" &&
    Array.isArray(value.images)
  );
}

function isDeletedSnapshot(value: unknown): value is DeletedProductSnapshot {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.category === "string" &&
    typeof value.description === "string"
  );
}

function isProductChanges(value: unknown): value is ProductChanges {
  return (
    isRecord(value) &&
    Array.isArray(value.created) &&
    value.created.every(isStoredProduct) &&
    isRecord(value.updated) &&
    Object.values(value.updated).every(isStoredProduct) &&
    isRecord(value.deleted) &&
    Object.values(value.deleted).every(isDeletedSnapshot)
  );
}

function readChanges(): ProductChanges {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return EMPTY_PRODUCT_CHANGES;
    const parsed: unknown = JSON.parse(stored);
    return isProductChanges(parsed) ? parsed : EMPTY_PRODUCT_CHANGES;
  } catch {
    return EMPTY_PRODUCT_CHANGES;
  }
}

function persistChanges(changes: ProductChanges | null) {
  try {
    if (changes) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    return;
  }
}

function writeChanges(changes: ProductChanges) {
  cachedChanges = changes;
  persistChanges(countProductChanges(changes) > 0 ? changes : null);
  listeners.forEach((listener) => listener());
}

function omitKey<T>(record: Record<string, T>, key: number): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).filter(([entryKey]) => entryKey !== String(key)),
  );
}

export function getProductChanges(): ProductChanges {
  cachedChanges ??= readChanges();
  return cachedChanges;
}

export function subscribeToProductChanges(listener: () => void) {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    cachedChanges = readChanges();
    listener();
  }

  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function generateLocalProductId(): number {
  const ids = getProductChanges().created.map((product) => product.id);
  return Math.max(Date.now(), ...ids.map((id) => id + 1));
}

export function saveProduct(product: Product) {
  const changes = getProductChanges();

  if (isLocalProductId(product.id)) {
    const exists = changes.created.some((item) => item.id === product.id);
    writeChanges({
      ...changes,
      created: exists
        ? changes.created.map((item) => (item.id === product.id ? product : item))
        : [product, ...changes.created],
    });
    return;
  }

  writeChanges({
    ...changes,
    updated: { ...changes.updated, [product.id]: product },
  });
}

export function markProductDeleted(product: Product) {
  const changes = getProductChanges();

  if (isLocalProductId(product.id)) {
    writeChanges({
      ...changes,
      created: changes.created.filter((item) => item.id !== product.id),
    });
    return;
  }

  writeChanges({
    ...changes,
    updated: omitKey(changes.updated, product.id),
    deleted: {
      ...changes.deleted,
      [product.id]: {
        id: product.id,
        title: product.title,
        category: product.category,
        description: product.description,
      },
    },
  });
}

export function restoreDeletedProduct(id: number) {
  const changes = getProductChanges();
  writeChanges({ ...changes, deleted: omitKey(changes.deleted, id) });
}

export function resetProductChanges() {
  writeChanges(EMPTY_PRODUCT_CHANGES);
}
