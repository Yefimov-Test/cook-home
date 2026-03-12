"use client";

import { useActionState, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { createOrder } from "@/actions/order";
import { PLATFORM_FEE_RATE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2, MapPin, Phone } from "lucide-react";

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(0)} ₽`;
}

type OrderResult = {
  success?: boolean;
  error?: string;
  orderId?: string;
  cookPhone?: string | null;
  pickupAddress?: string | null;
} | null;

export function CheckoutForm() {
  const { items, cookId, cookName, getTotal, clearCart } = useCart();
  const [pickupTime, setPickupTime] = useState("");

  const subtotal = getTotal();
  const fee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const total = subtotal + fee;

  const [state, formAction, isPending] = useActionState(
    async (_prev: OrderResult, formData: FormData) => {
      formData.set("cookId", cookId ?? "");
      formData.set("items", JSON.stringify(items));
      const result = await createOrder(formData);
      if (result.success) {
        clearCart();
      }
      return result;
    },
    null
  );

  if (state?.success) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
          <CheckCircle className="size-12 text-green-500" />
          <h2 className="text-lg font-medium">Заказ оформлен!</h2>
          <p className="text-sm text-muted-foreground">
            Номер заказа: {state.orderId}
          </p>
          {state.cookPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="size-4 text-muted-foreground" />
              <span>{state.cookPhone}</span>
            </div>
          )}
          {state.pickupAddress && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-muted-foreground" />
              <span>{state.pickupAddress}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Корзина пуста</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ваш заказ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Повар: {cookName}</p>
          <ul className="space-y-1">
            {items.map((item) => (
              <li
                key={item.dishId}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="flex justify-between text-sm">
            <span>Подытог</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Сервисный сбор ({Math.round(PLATFORM_FEE_RATE * 100)}%)
            </span>
            <span>{formatPrice(fee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Самовывоз</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickupDate">Дата</Label>
            <Input
              id="pickupDate"
              name="pickupDate"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupTime">Время</Label>
            <Input
              id="pickupTime"
              name="pickupTime"
              type="time"
              required
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          {state?.error && (
            <p className="text-sm text-destructive w-full">{state.error}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Оплатить {formatPrice(total)}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
