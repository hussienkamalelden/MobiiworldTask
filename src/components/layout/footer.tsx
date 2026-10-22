export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-sm text-fg-muted sm:px-6 lg:px-8">
        Product data provided by{" "}
        <a
          href="https://dummyjson.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded font-medium text-accent-fg underline-offset-4 hover:underline"
        >
          DummyJSON
        </a>
      </div>
    </footer>
  );
}
