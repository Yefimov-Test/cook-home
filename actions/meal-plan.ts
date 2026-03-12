"use server";

import { createClient } from "@/lib/supabase/server";
import { mealPlanSchema } from "@/lib/validations/cook";
import { revalidatePath } from "next/cache";

export async function createMealPlan(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    interval: formData.get("interval"),
    includes: formData.get("includes"),
  };

  const parsed = mealPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase.from("meal_plans").insert({
    cook_id: user.id,
    name: parsed.data.name,
    description: parsed.data.description || null,
    price: Math.round(parsed.data.price * 100),
    interval: parsed.data.interval,
    includes: parsed.data.includes,
  });

  if (error) return { error: error.message };

  revalidatePath("/meal-plans", "page");
  return { success: true };
}

export async function updateMealPlan(planId: string, formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    interval: formData.get("interval"),
    includes: formData.get("includes"),
  };

  const parsed = mealPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase
    .from("meal_plans")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: Math.round(parsed.data.price * 100),
      interval: parsed.data.interval,
      includes: parsed.data.includes,
    })
    .eq("id", planId)
    .eq("cook_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/meal-plans", "page");
  return { success: true };
}

export async function deleteMealPlan(planId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase
    .from("meal_plans")
    .delete()
    .eq("id", planId)
    .eq("cook_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/meal-plans", "page");
  return { success: true };
}

export async function toggleMealPlanActive(planId: string, isActive: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase
    .from("meal_plans")
    .update({ is_active: isActive })
    .eq("id", planId)
    .eq("cook_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/meal-plans", "page");
  return { success: true };
}
