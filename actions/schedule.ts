"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAvailability(
  slots: { day_of_week: number; start_time: string; end_time: string; is_active: boolean }[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  // Delete existing slots and insert new ones
  await supabase
    .from("availability_slots")
    .delete()
    .eq("cook_id", user.id);

  if (slots.length > 0) {
    const { error } = await supabase.from("availability_slots").insert(
      slots.map((s) => ({
        cook_id: user.id,
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        is_active: s.is_active,
      }))
    );

    if (error) return { error: error.message };
  }

  revalidatePath("/schedule", "page");
  return { success: true };
}
