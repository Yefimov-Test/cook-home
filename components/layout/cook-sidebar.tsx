"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  ShoppingBag,
  Calendar,
  UserCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/cook/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/cook/menu", label: "Меню", icon: UtensilsCrossed },
  { href: "/cook/meal-plans", label: "Подписки", icon: Package },
  { href: "/cook/orders", label: "Заказы", icon: ShoppingBag },
  { href: "/cook/schedule", label: "Расписание", icon: Calendar },
  { href: "/cook/profile", label: "Профиль", icon: UserCircle },
  { href: "/cook/settings", label: "Настройки", icon: Settings },
];

export function CookSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-border/40 bg-muted/20 p-4">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
