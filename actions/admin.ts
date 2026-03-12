"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован", supabase: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Нет доступа", supabase: null };

  return { error: null, supabase };
}

export async function approveCook(cookId: string) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) return { error: error ?? "Ошибка авторизации" };

  const { error: updateError } = await supabase
    .from("cook_profiles")
    .update({ is_approved: true })
    .eq("id", cookId);

  if (updateError) return { error: updateError.message };

  revalidatePath("/moderation");
  return { success: true };
}

export async function rejectCook(cookId: string) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) return { error: error ?? "Ошибка авторизации" };

  const { error: updateError } = await supabase
    .from("cook_profiles")
    .update({ is_approved: false, is_active: false })
    .eq("id", cookId);

  if (updateError) return { error: updateError.message };

  revalidatePath("/moderation");
  return { success: true };
}
