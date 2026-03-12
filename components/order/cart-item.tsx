"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartItem as CartItemType } from "@/hooks/use-cart";

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(0)} ₽`;
}

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 py-3">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="size-12 rounded-lg object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatPrice(item.price)}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
        >
          <Minus />
        </Button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
        >
          <Plus />
        </Button>
      </div>
      <div className="w-16 text-right text-sm font-medium">
        {formatPrice(item.price * item.quantity)}
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => removeItem(item.dishId)}
      >
        <Trash2 className="text-muted-foreground" />
      </Button>
    </div>
  );
}
