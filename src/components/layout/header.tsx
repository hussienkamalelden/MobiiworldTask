import { RoleSwitcher } from "@/components/roles/role-switcher";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { SettingsMenu } from "./settings-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 rounded-2xl border border-line bg-surface/75 px-3 shadow-lg shadow-black/5 backdrop-blur-xl sm:h-16 sm:px-4">
        <Logo compact />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <MainNav />
          <span aria-hidden="true" className="mx-1 hidden h-6 w-px bg-line sm:block" />
          <RoleSwitcher />
          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}
