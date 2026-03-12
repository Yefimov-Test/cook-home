"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { cancelSubscription } from "@/actions/subscription";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Subscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  preferred_days: number[];
  preferred_time: string;
  meal_plans: {
    name: string;
    price: number;
    interval: string;
  } | null;
  cook_profiles: {
    profiles: { full_name: string } | null;
  } | null;
}

const DAY_NAMES = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const statusLabels: Record<string, { label: string; className: string }> = {
  active: {
    label: "Активна",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  paused: {
    label: "Приостановлена",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  cancelled: {
    label: "Отменена",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(0)} ₽`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU");
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("subscriptions")
        .select(
          `
          id,
          status,
          current_period_start,
          current_period_end,
          preferred_days,
          preferred_time,
          meal_plans (name, price, interval),
          cook_profiles (profiles (full_name))
        `
        )
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      setSubscriptions((data as unknown as Subscription[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleCancel(id: string) {
    setCancellingId(id);
    startTransition(async () => {
      const result = await cancelSubscription(id);
      if (result.success) {
        setSubscriptions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, status: "cancelled" } : s
          )
        );
      }
      setCancellingId(null);
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Мои подписки</h1>
      {subscriptions.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          У вас пока нет подписок
        </p>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => {
            const st = statusLabels[sub.status] ?? statusLabels.active;
            return (
              <Card key={sub.id}>
                <CardHeader>
                  <CardTitle>
                    {sub.meal_plans?.name ?? "План питания"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Статус:</span>
                    <Badge variant="outline" className={st.className}>
                      {st.label}
                    </Badge>
                  </div>
                  <p>
                    <span className="text-muted-foreground">Повар: </span>
                    {sub.cook_profiles?.profiles?.full_name ?? "Повар"}
                  </p>
                  {sub.meal_plans && (
                    <p>
                      <span className="text-muted-foreground">Цена: </span>
                      {formatPrice(sub.meal_plans.price)}
                    </p>
                  )}
                  <p>
                    <span className="text-muted-foreground">Период: </span>
                    {formatDate(sub.current_period_start)} &ndash;{" "}
                    {formatDate(sub.current_period_end)}
                  </p>
                  {sub.preferred_days?.length > 0 && (
                    <p>
                      <span className="text-muted-foreground">Дни: </span>
                      {sub.preferred_days.map((d) => DAY_NAMES[d]).join(", ")}
                    </p>
                  )}
                  <p>
                    <span className="text-muted-foreground">Время: </span>
                    {sub.preferred_time}
                  </p>
                </CardContent>
                {sub.status === "active" && (
                  <CardFooter>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending && cancellingId === sub.id}
                      onClick={() => handleCancel(sub.id)}
                    >
                      {isPending && cancellingId === sub.id && (
                        <Loader2 className="animate-spin" />
                      )}
                      Отменить
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
