"use client";

import { Search } from "lucide-react";
import { useEffect, useEffectEvent, useId, useState } from "react";
import type { FormEvent } from "react";

const SEARCH_DELAY_MS = 400;

interface SearchFieldProps {
  value: string;
  onSearch: (value: string) => void;
  className?: string;
}

export function SearchField({ value, onSearch, className = "" }: SearchFieldProps) {
  const inputId = useId();
  const [input, setInput] = useState(value);
  const [committed, setCommitted] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  if (value !== syncedValue) {
    setSyncedValue(value);
    if (value !== committed) {
      setCommitted(value);
      setInput(value);
    }
  }

  const commitSearch = useEffectEvent((query: string) => {
    setCommitted(query);
    onSearch(query);
  });

  useEffect(() => {
    const query = input.trim();
    if (query === committed) return;

    const timeout = window.setTimeout(() => commitSearch(query), SEARCH_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [input, committed]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = input.trim();
    if (query === committed) return;
    setCommitted(query);
    onSearch(query);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label htmlFor={inputId} className="sr-only">
        Search products by title
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
        <input
          id={inputId}
          type="search"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Search products..."
          autoComplete="off"
          className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-10 text-sm text-fg transition-colors placeholder:text-fg-subtle hover:border-accent-line"
        />
      </div>
    </form>
  );
}
