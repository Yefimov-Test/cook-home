import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { SwitchRoleButton } from "./switch-role-button";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `
      full_name,
      phone,
      role,
      cities (name),
      districts (name)
    `
    )
    .eq("id", user.id)
    .single();

  const city = (profile?.cities as unknown as { name: string } | null)?.name;
  const district = (profile?.districts as unknown as { name: string } | null)?.name;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Настройки</h1>

      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Имя: </span>
            {profile?.full_name ?? "Не указано"}
          </div>
          <div>
            <span className="text-muted-foreground">Email: </span>
            {user.email}
          </div>
          {profile?.phone && (
            <div>
              <span className="text-muted-foreground">Телефон: </span>
              {profile.phone}
            </div>
          )}
          {city && (
            <div>
              <span className="text-muted-foreground">Город: </span>
              {city}
            </div>
          )}
          {district && (
            <div>
              <span className="text-muted-foreground">Район: </span>
              {district}
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Роль: </span>
            {profile?.role === "cook" ? "Повар" : "Клиент"}
          </div>
        </CardContent>
      </Card>

      {profile?.role !== "cook" && (
        <Card>
          <CardHeader>
            <CardTitle>Стать поваром</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Хотите готовить и продавать домашнюю еду? Переключитесь на роль повара.
            </p>
            <SwitchRoleButton />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
