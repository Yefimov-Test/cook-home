import type { OrderStatus } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    new: {
      label: "Новый",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    accepted: {
      label: "Принят",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    cooking: {
      label: "Готовится",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    },
    ready: {
      label: "Готов",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    picked_up: {
      label: "Забран",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    },
    cancelled: {
      label: "Отменён",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  };

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] ?? statusConfig.new;
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
