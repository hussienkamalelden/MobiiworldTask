type NavigationListener = (url: URL) => void;

const listeners = new Set<NavigationListener>();

function isCurrentLocation(url: URL): boolean {
  return url.pathname === window.location.pathname && url.search === window.location.search;
}

export function startNavigationProgress(href: string) {
  const url = new URL(href, window.location.href);

  window.setTimeout(() => {
    if (isCurrentLocation(url)) return;
    listeners.forEach((listener) => listener(url));
  }, 0);
}

export function subscribeToNavigationStart(listener: NavigationListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
