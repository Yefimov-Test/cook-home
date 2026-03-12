import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Users, DollarSign } from "lucide-react";

export default async function CookDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cookProfile } = await supabase
    .from("cook_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!cookProfile) redirect("/cook/profile");

  // Today's orders
  const today = new Date().toISOString().split("T")[0];
  const { data: todayOrders } = await supabase
    .from("orders")
    .select("*, order_items(*, dishes(name))")
    .eq("cook_id", user.id)
    .eq("pickup_date", today)
    .order("created_at", { ascending: false });

  // Active subscriptions
  const { data: activeSubscriptions } = await supabase
    .from("subscriptions")
    .select("*, profiles(full_name), meal_plans(name)")
    .eq("cook_id", user.id)
    .eq("status", "active");

  // Stats
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("cook_id", user.id)
    .neq("status", "cancelled");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Дашборд</h1>
          {!cookProfile.is_approved && (
            <Badge variant="outline" className="mt-1">На модерации</Badge>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs">Заказы сегодня</span>
            </div>
            <p className="text-2xl font-bold">{todayOrders?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Star className="h-4 w-4" />
              <span className="text-xs">Рейтинг</span>
            </div>
            <p className="text-2xl font-bold">{cookProfile.avg_rating || "–"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Подписчики</span>
            </div>
            <p className="text-2xl font-bold">{activeSubscriptions?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Всего заказов</span>
            </div>
            <p className="text-2xl font-bold">{totalOrders ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's orders */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Заказы на сегодня</CardTitle>
        </CardHeader>
        <CardContent>
          {!todayOrders?.length ? (
            <p className="text-sm text-muted-foreground py-4">Заказов на сегодня нет</p>
          ) : (
            <div className="space-y-3">
              {todayOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {(order.order_items as any[])?.map((i: any) => i.dishes?.name).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Самовывоз: {order.pickup_time}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{order.status}</Badge>
                    <p className="text-sm font-medium mt-1">{(order.total_amount / 100).toFixed(0)} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active subscriptions */}
      {(activeSubscriptions?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Активные подписчики</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeSubscriptions!.map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{(sub.profiles as any)?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{(sub.meal_plans as any)?.name}</p>
                  </div>
                  <Badge>Активна</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
