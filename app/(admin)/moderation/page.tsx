import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { approveCook, rejectCook } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export default async function ModerationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  // Fetch pending cooks with profile info
  const { data: pendingCooks } = await supabase
    .from("cook_profiles")
    .select(
      `
      id,
      description,
      cuisine_type,
      pickup_address,
      profiles!inner (
        full_name,
        phone,
        cities ( name ),
        districts ( name )
      )
    `
    )
    .eq("is_approved", false)
    .eq("is_active", true);

  // Counts
  const { count: approvedCount } = await supabase
    .from("cook_profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_approved", true);

  const { count: rejectedCount } = await supabase
    .from("cook_profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_approved", false)
    .eq("is_active", false);

  const cooks = pendingCooks ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Модерация кулинаров</h2>
        <div className="mt-2 flex gap-3">
          <Badge variant="outline" className="text-sm">
            Одобрено: {approvedCount ?? 0}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Отклонено: {rejectedCount ?? 0}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Ожидают: {cooks.length}
          </Badge>
        </div>
      </div>

      {cooks.length === 0 ? (
        <p className="text-muted-foreground">Нет заявок на модерацию</p>
      ) : (
        <div className="grid gap-4">
          {cooks.map((cook: any) => {
            const p = cook.profiles;
            return (
              <Card key={cook.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{p.full_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cook.description && (
                    <p className="text-sm text-muted-foreground">
                      {cook.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {(cook.cuisine_type as string[])?.map((ct: string) => (
                      <Badge key={ct} variant="secondary">
                        {ct}
                      </Badge>
                    ))}
                  </div>

                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">Телефон</dt>
                    <dd>{p.phone ?? "—"}</dd>
                    <dt className="text-muted-foreground">Город</dt>
                    <dd>
                      {p.cities?.name ?? "—"}
                      {p.districts?.name ? `, ${p.districts.name}` : ""}
                    </dd>
                    <dt className="text-muted-foreground">Адрес самовывоза</dt>
                    <dd>{cook.pickup_address ?? "—"}</dd>
                  </dl>

                  <div className="flex gap-2 pt-2">
                    <form action={async () => { "use server"; await approveCook(cook.id); }}>
                      <Button type="submit" size="sm">
                        <Check className="mr-1.5 size-4" />
                        Одобрить
                      </Button>
                    </form>
                    <form action={async () => { "use server"; await rejectCook(cook.id); }}>
                      <Button type="submit" variant="outline" size="sm">
                        <X className="mr-1.5 size-4" />
                        Отклонить
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
