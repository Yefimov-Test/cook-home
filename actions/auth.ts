"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signup(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
    city_id: formData.get("city_id"),
    district_id: formData.get("district_id"),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Update profile with city/district
  if (data.user) {
    await supabase
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
        city_id: parsed.data.city_id,
        district_id: parsed.data.district_id || null,
      })
      .eq("id", data.user.id);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function login(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function switchRole(newRole: "client" | "cook") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
