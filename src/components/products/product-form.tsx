"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { showToast } from "@/hooks/use-toasts";
import {
  EMPTY_PRODUCT_FORM,
  PRODUCT_LIMITS,
  createProductSchema,
  toProductFormValues,
} from "@/lib/product-schema";
import type { ProductFormField, ProductFormValues } from "@/lib/product-schema";
import { ApiError } from "@/services/api-client";
import { createProduct, updateProduct } from "@/services/product-service";
import type { Category, Product, ProductInput } from "@/types/product";
import { Button, buttonStyles } from "@/components/ui/button";
import { FormField, fieldStyles, getFieldDescriptionId } from "@/components/ui/form-field";

type ProductFormProps = { categories: Category[] } & (
  | { mode: "create"; product?: undefined }
  | { mode: "edit"; product: Product }
);

interface FieldConfig {
  label: string;
  required?: boolean;
  hint?: string;
}

const FIELD_CONFIG: Record<ProductFormField, FieldConfig> = {
  title: {
    label: "Title",
    required: true,
    hint: `Between ${PRODUCT_LIMITS.titleMin} and ${PRODUCT_LIMITS.titleMax} characters.`,
  },
  brand: { label: "Brand" },
  category: { label: "Category", required: true },
  description: { label: "Description" },
  price: { label: "Price", required: true, hint: "In USD, up to 2 decimal places." },
  stock: { label: "Stock", hint: "Whole number of units available." },
  rating: {
    label: "Rating",
    hint: `A value between ${PRODUCT_LIMITS.ratingMin} and ${PRODUCT_LIMITS.ratingMax}.`,
  },
  thumbnail: { label: "Image URL", hint: "Link to a product image." },
};

const SIMULATED_REQUEST_NOTE =
  "DummyJSON simulates this request, so the change is not persisted.";

function getFieldId(field: ProductFormField): string {
  return `product-${field}`;
}

interface FormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-base font-semibold text-fg">{title}</h2>
      <p className="mt-1 text-sm text-fg-muted">{description}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function ProductForm({ mode, categories, product }: ProductFormProps) {
  const router = useRouter();
  const schema = useMemo(
    () => createProductSchema(categories.map((category) => category.slug)),
    [categories],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProductFormValues, unknown, ProductInput>({
    resolver: zodResolver(schema),
    defaultValues: product ? toProductFormValues(product) : EMPTY_PRODUCT_FORM,
    mode: "onTouched",
  });

  const description = useWatch({ control, name: "description" });
  const isBusy = isSubmitting || isSubmitSuccessful;
  const serverError = errors.root?.server?.message;
  const cancelHref = product ? `/products/${product.id}` : "/products";

  function getField(field: ProductFormField, hintOverride?: string) {
    const id = getFieldId(field);
    const { label, required = false, hint: defaultHint } = FIELD_CONFIG[field];
    const hint = hintOverride ?? defaultHint;
    const error = errors[field]?.message;

    return {
      hasError: error !== undefined,
      wrapper: { id, label, required, hint, error },
      control: {
        id,
        ...register(field),
        "aria-required": required || undefined,
        "aria-invalid": error !== undefined || undefined,
        "aria-describedby": getFieldDescriptionId(id, { error, hint }),
      },
    };
  }

  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
    try {
      if (mode === "edit") {
        await updateProduct(product.id, data);
        showToast({
          tone: "success",
          title: "Product updated",
          description: `"${data.title}" was updated. ${SIMULATED_REQUEST_NOTE}`,
        });
        router.push(`/products/${product.id}`);
      } else {
        await createProduct(data);
        showToast({
          tone: "success",
          title: "Product created",
          description: `"${data.title}" was created. ${SIMULATED_REQUEST_NOTE}`,
        });
        router.push("/products");
      }
    } catch (error) {
      setError("root.server", {
        message:
          error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      });
    }
  };

  const title = getField("title");
  const brand = getField("brand");
  const category = getField("category");
  const descriptionField = getField(
    "description",
    `${description.trim().length}/${PRODUCT_LIMITS.descriptionMax} characters.`,
  );
  const price = getField("price");
  const stock = getField("stock");
  const rating = getField("rating");
  const thumbnail = getField("thumbnail");

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-sm text-fg-muted">
        Fields marked with <span className="text-danger-fg">*</span> are required.
      </p>

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger-fg"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-semibold">
              {mode === "edit" ? "Could not save changes." : "Could not create product."}
            </span>{" "}
            {serverError}
          </p>
        </div>
      )}

      <fieldset disabled={isBusy} className="min-w-0 space-y-6">
        <FormSection
          title="Basic information"
          description="The name, brand and category shown across the catalog."
        >
          <div className="sm:col-span-2">
            <FormField {...title.wrapper}>
              <input
                type="text"
                autoComplete="off"
                className={`h-11 ${fieldStyles(title.hasError)}`}
                {...title.control}
              />
            </FormField>
          </div>
          <FormField {...brand.wrapper}>
            <input
              type="text"
              autoComplete="off"
              className={`h-11 ${fieldStyles(brand.hasError)}`}
              {...brand.control}
            />
          </FormField>
          <FormField {...category.wrapper}>
            <select
              className={`h-11 cursor-pointer ${fieldStyles(category.hasError)}`}
              {...category.control}
            >
              <option value="">Select a category</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </FormField>
          <div className="sm:col-span-2">
            <FormField {...descriptionField.wrapper}>
              <textarea
                rows={4}
                className={`resize-y py-3 ${fieldStyles(descriptionField.hasError)}`}
                {...descriptionField.control}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          title="Pricing and inventory"
          description="Set the price, available stock and customer rating."
        >
          <div className="sm:col-span-2">
            <FormField {...price.wrapper}>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-fg-subtle"
                >
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0.00"
                  className={`h-11 pl-8 ${fieldStyles(price.hasError)}`}
                  {...price.control}
                />
              </div>
            </FormField>
          </div>
          <FormField {...stock.wrapper}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0"
              className={`h-11 ${fieldStyles(stock.hasError)}`}
              {...stock.control}
            />
          </FormField>
          <FormField {...rating.wrapper}>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              className={`h-11 ${fieldStyles(rating.hasError)}`}
              {...rating.control}
            />
          </FormField>
        </FormSection>

        <FormSection title="Media" description="An optional image displayed with the product.">
          <div className="sm:col-span-2">
            <FormField {...thumbnail.wrapper}>
              <input
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="https://"
                className={`h-11 ${fieldStyles(thumbnail.hasError)}`}
                {...thumbnail.control}
              />
            </FormField>
          </div>
        </FormSection>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          aria-disabled={isBusy || undefined}
          className={buttonStyles({
            variant: "secondary",
            className: isBusy ? "pointer-events-none opacity-50" : "",
          })}
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isBusy} className="sm:min-w-40">
          {isBusy && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {mode === "edit"
            ? isBusy
              ? "Saving..."
              : "Save changes"
            : isBusy
              ? "Creating..."
              : "Create product"}
        </Button>
      </div>
    </form>
  );
}
