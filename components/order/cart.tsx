"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "./cart-item";
import { PLATFORM_FEE_RATE } from "@/lib/constants";

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(0)} ₽`;
}

export function Cart() {
  const { items, cookName, getTotal, clearCart } = useCart();
  const subtotal = getTotal();
  const fee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const total = subtotal + fee;

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
          {cookName && (
            <p className="text-sm text-muted-foreground">Повар: {cookName}</p>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Корзина пуста</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.dishId} item={item} />
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col gap-3">
              <div className="flex w-full justify-between text-sm">
                <span>Подытог</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex w-full justify-between text-sm text-muted-foreground">
                <span>Сервисный сбор ({Math.round(PLATFORM_FEE_RATE * 100)}%)</span>
                <span>{formatPrice(fee)}</span>
              </div>
              <Separator />
              <div className="flex w-full justify-between font-medium">
                <span>Итого</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button className="w-full" render={<Link href="/checkout" />}>
                Оформить заказ
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => clearCart()}
              >
                Очистить корзину
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
