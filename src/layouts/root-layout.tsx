import { HomeIcon, SettingsIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col pt-[env(safe-area-inset-top)]">
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <nav className="sticky bottom-0 grid grid-cols-2 border-t bg-background pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 py-2 text-xs text-muted-foreground",
                isActive && "text-primary",
              )
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
