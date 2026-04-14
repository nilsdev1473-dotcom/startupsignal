"use client";

import { Database, LayoutDashboard, Skull } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Ideas Database", href: "/ideas", icon: Database },
  { label: "Failure Library", href: "/failures", icon: Skull },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 h-screen w-60 flex-col"
      style={{
        backgroundColor: "#111113",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-6 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <span
          className="text-base font-semibold tracking-tight"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          StartupSignal
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group"
              style={{
                backgroundColor: isActive
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
                color: isActive
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.5)",
                borderLeft: isActive
                  ? "2px solid #8B5CF6"
                  : "2px solid transparent",
              }}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          v1.0 · Beta
        </p>
      </div>
    </aside>
  );
}
