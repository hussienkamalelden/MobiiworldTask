import { startNavigationProgress } from "@/lib/navigation-progress";

export function onRouterTransitionStart(url: string) {
  startNavigationProgress(url);
}
