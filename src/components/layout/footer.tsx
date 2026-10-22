export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-sm text-slate-600 sm:px-6 lg:px-8">
        Product data provided by{" "}
        <a
          href="https://dummyjson.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded font-medium text-indigo-700 underline-offset-4 hover:underline"
        >
          DummyJSON
        </a>
      </div>
    </footer>
  );
}
