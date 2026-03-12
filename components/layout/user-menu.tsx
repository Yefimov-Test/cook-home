"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, LogOut, ShoppingBag, ChefHat } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface UserMenuProps {
  name: string;
  role: string;
}

export function UserMenu({ name, role }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline max-w-[120px] truncate">{name}</span>
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-popover p-1 shadow-md z-50">
          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
          >
            <ShoppingBag className="h-4 w-4" />
            Мои заказы
          </Link>

          {(role === "cook" || role === "admin") && (
            <Link
              href="/cook/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              <ChefHat className="h-4 w-4" />
              Панель повара
            </Link>
          )}

          <form
            action={async () => {
              await logout();
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
