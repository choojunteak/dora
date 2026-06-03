"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/app", label: "Home" },
  { href: "/app/map", label: "Map" },
  { href: "/app/lists", label: "Lists" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {navItems.map((item) => {
          const active =
            item.href === "/app/lists" ? pathname?.startsWith("/app/lists") : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-3 text-center text-sm font-black transition ${
                active ? "bg-ink text-white" : "text-stone-500 hover:bg-stone-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
