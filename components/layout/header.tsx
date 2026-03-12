import Link from "next/link";
import { UtensilsCrossed, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "./user-menu";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">HomeCook</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Каталог
          </Link>
          <Link
            href="/become-a-cook"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Стать поваром
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          {user && profile ? (
            <UserMenu name={profile.full_name || user.email || ""} role={profile.role} />
          ) : (
            <Button variant="outline" size="sm" render={<Link href="/login" />}>
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
