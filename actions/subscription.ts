"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { subscriptionSchema } from "@/lib/validations/order";
import { simulatePayment } from "@/lib/payments/mock";

export async function createSubscription(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  let preferredDays: number[];
  try {
    preferredDays = JSON.parse(formData.get("preferredDays") as string);
  } catch {
    return { error: "Неверный формат дней" };
  }

  const raw = {
    mealPlanId: formData.get("mealPlanId"),
    preferredDays,
    preferredTime: formData.get("preferredTime"),
  };

  const parsed = subscriptionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Fetch meal plan price and cook
  const { data: mealPlan, error: planError } = await supabase
    .from("meal_plans")
    .select("price, cook_id, cook_profiles(pickup_address, profiles(phone))")
    .eq("id", parsed.data.mealPlanId)
    .single();

  if (planError || !mealPlan) {
    return { error: "План питания не найден" };
  }

  const payment = await simulatePayment(mealPlan.price);
  if (!payment.success) {
    return { error: "Ошибка оплаты" };
  }

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + 30);

  const { error: subError } = await supabase.from("subscriptions").insert({
    client_id: user.id,
    cook_id: mealPlan.cook_id,
    meal_plan_id: parsed.data.mealPlanId,
    status: "active",
    payment_id: payment.paymentId,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    preferred_days: parsed.data.preferredDays,
    preferred_time: parsed.data.preferredTime,
  });

  if (subError) {
    return { error: subError.message };
  }

  const cookProfile = mealPlan.cook_profiles as unknown as {
    pickup_address: string | null;
    profiles: { phone: string | null } | null;
  } | null;

  revalidatePath("/subscriptions", "page");

  return {
    success: true,
    cookPhone: cookProfile?.profiles?.phone ?? null,
    pickupAddress: cookProfile?.pickup_address ?? null,
  };
}

export async function cancelSubscription(subscriptionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("id", subscriptionId)
    .eq("client_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/subscriptions", "page");
  return { success: true };
}
