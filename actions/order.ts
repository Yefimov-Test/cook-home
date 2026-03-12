"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/validations/order";
import { simulatePayment } from "@/lib/payments/mock";
import { PLATFORM_FEE_RATE } from "@/lib/constants";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .eq("cook_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/orders", "page");
  return { success: true };
}

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const raw = {
    cookId: formData.get("cookId"),
    items: formData.get("items"),
    pickupDate: formData.get("pickupDate"),
    pickupTime: formData.get("pickupTime"),
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let cartItems: { dishId: string; quantity: number; price: number }[];
  try {
    cartItems = JSON.parse(parsed.data.items);
  } catch {
    return { error: "Неверный формат корзины" };
  }

  if (!cartItems.length) return { error: "Корзина пуста" };

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const total = subtotal + platformFee;

  const payment = await simulatePayment(total);
  if (!payment.success) {
    return { error: "Ошибка оплаты" };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      client_id: user.id,
      cook_id: parsed.data.cookId,
      status: "new",
      total_amount: subtotal,
      platform_fee: platformFee,
      pickup_date: parsed.data.pickupDate,
      pickup_time: parsed.data.pickupTime,
      payment_intent_id: payment.paymentId,
      payment_provider: payment.provider,
      paid_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Ошибка создания заказа" };
  }

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    dish_id: item.dishId,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return { error: itemsError.message };
  }

  // Fetch cook contact info
  const { data: cookProfile } = await supabase
    .from("cook_profiles")
    .select("pickup_address, profiles(phone)")
    .eq("id", parsed.data.cookId)
    .single();

  revalidatePath("/orders", "page");

  return {
    success: true,
    orderId: order.id,
    cookPhone: (cookProfile?.profiles as unknown as { phone: string | null } | null)
      ?.phone ?? null,
    pickupAddress: cookProfile?.pickup_address ?? null,
  };
}
