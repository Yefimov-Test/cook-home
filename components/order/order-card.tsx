import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import type { OrderStatus } from "@/lib/constants";
import { MapPin, Phone } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number; // cents
  dishes: { name: string } | null;
}

interface OrderCardProps {
  order: {
    id: string;
    status: OrderStatus;
    total_amount: number; // cents
    platform_fee: number; // cents
    pickup_date: string;
    pickup_time: string;
    payment_intent_id: string | null;
    created_at: string;
    cook_profiles: {
      pickup_address: string | null;
      profiles: { full_name: string; phone: string | null } | null;
    } | null;
    order_items: OrderItem[];
  };
}

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(0)} ₽`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function OrderCard({ order }: OrderCardProps) {
  const cookName =
    order.cook_profiles?.profiles?.full_name ?? "Повар";
  const isPaid = !!order.payment_intent_id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заказ от {formatDate(order.created_at)}</CardTitle>
        <CardAction>
          <OrderStatusBadge status={order.status} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Повар: {cookName}</p>
        <ul className="space-y-1">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                {item.dishes?.name ?? "Блюдо"} x{item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between pt-2 font-medium text-sm border-t">
          <span>Итого</span>
          <span>{formatPrice(order.total_amount + order.platform_fee)}</span>
        </div>

        <p className="text-sm text-muted-foreground">
          Самовывоз: {order.pickup_date}, {order.pickup_time}
        </p>

        {isPaid && order.cook_profiles && (
          <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-sm">
            {order.cook_profiles.profiles?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-muted-foreground" />
                <span>{order.cook_profiles.profiles.phone}</span>
              </div>
            )}
            {order.cook_profiles.pickup_address && (
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-muted-foreground" />
                <span>{order.cook_profiles.pickup_address}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
