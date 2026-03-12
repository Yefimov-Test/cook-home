"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  new: "Новый",
  accepted: "Принят",
  cooking: "Готовится",
  ready: "Готов",
  picked_up: "Выдан",
  cancelled: "Отменён",
};

const NEXT_STATUS: Record<string, string> = {
  new: "accepted",
  accepted: "cooking",
  cooking: "ready",
  ready: "picked_up",
};

const NEXT_STATUS_LABEL: Record<string, string> = {
  new: "Принять",
  accepted: "Начать готовку",
  cooking: "Готово",
  ready: "Выдан",
};

export function CookOrderList({ orders }: { orders: any[] }) {
  async function updateStatus(orderId: string, newStatus: string) {
    const { updateOrderStatus } = await import("@/actions/order");
    const result = await updateOrderStatus(orderId, newStatus);
    if (result?.error) toast.error(result.error);
    else toast.success(`Статус обновлён: ${STATUS_LABELS[newStatus]}`);
  }

  if (orders.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Заказов пока нет</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={order.status === "new" ? "default" : "secondary"}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {order.pickup_date} • {order.pickup_time}
                  </span>
                </div>
                <p className="text-sm font-medium">
                  {order.profiles?.full_name}
                  {order.profiles?.phone && (
                    <span className="text-muted-foreground ml-2">{order.profiles.phone}</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.order_items?.map((i: any) =>
                    `${i.dishes?.name} x${i.quantity}`
                  ).join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{(order.total_amount / 100).toFixed(0)} ₽</p>
                {NEXT_STATUS[order.status] && (
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}
                  >
                    {NEXT_STATUS_LABEL[order.status]}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
