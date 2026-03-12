"use server";

import { createClient } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validations/review";
import { revalidatePath } from "next/cache";

export async function createReview(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const raw = {
    orderId: formData.get("orderId"),
    cookId: formData.get("cookId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  };

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  // Verify order belongs to user and has correct status
  const { data: order } = await supabase
    .from("orders")
    .select("id, client_id, status")
    .eq("id", parsed.data.orderId)
    .single();

  if (!order) return { error: "Заказ не найден" };
  if (order.client_id !== user.id) return { error: "Это не ваш заказ" };
  if (order.status !== "picked_up") {
    return { error: "Отзыв можно оставить только после получения заказа" };
  }

  const { error: insertError } = await supabase.from("reviews").insert({
    order_id: parsed.data.orderId,
    client_id: user.id,
    cook_id: parsed.data.cookId,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: "Вы уже оставили отзыв к этому заказу" };
    }
    return { error: insertError.message };
  }

  revalidatePath(`/cook/${parsed.data.cookId}`);
  return { success: true };
}
