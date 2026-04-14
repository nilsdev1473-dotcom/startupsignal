"use client";

import { Database, LayoutDashboard, Search, Skull } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Ideas", href: "/ideas", icon: Database },
  { label: "Failures", href: "/failures", icon: Skull },
  { label: "Search", href: "/search", icon: Search },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        height: "64px",
        backgroundColor: "#0A0A0B",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-3"
              style={{
                color: isActive ? "#8B5CF6" : "rgba(255,255,255,0.35)",
              }}
            >
              <Icon size={20} />
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{
                  color: isActive ? "#8B5CF6" : "rgba(255,255,255,0.35)",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
