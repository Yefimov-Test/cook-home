"use server";

import { createClient } from "@/lib/supabase/server";
import { cookProfileSchema, dishSchema } from "@/lib/validations/cook";
import { generateSlug, ensureUniqueSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export async function createCookProfile(formData: FormData) {
  const raw = {
    full_name: formData.get("full_name"),
    description: formData.get("description"),
    cuisine_type: formData.getAll("cuisine_type"),
    pickup_address: formData.get("pickup_address"),
    phone: formData.get("phone"),
  };

  const parsed = cookProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  // Generate unique slug
  const baseSlug = generateSlug(parsed.data.full_name);
  const slug = await ensureUniqueSlug(baseSlug, async (s) => {
    const { data } = await supabase
      .from("cook_profiles")
      .select("id")
      .eq("slug", s)
      .single();
    return !!data;
  });

  // Update profile name and phone
  await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      role: "cook",
    })
    .eq("id", user.id);

  // Create cook profile
  // TODO: remove auto-approve, use admin moderation
  const { error } = await supabase.from("cook_profiles").insert({
    id: user.id,
    slug,
    cuisine_type: parsed.data.cuisine_type,
    description: parsed.data.description,
    pickup_address: parsed.data.pickup_address,
    is_approved: true,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true, slug };
}

export async function updateCookProfile(formData: FormData) {
  const raw = {
    full_name: formData.get("full_name"),
    description: formData.get("description"),
    cuisine_type: formData.getAll("cuisine_type"),
    pickup_address: formData.get("pickup_address"),
    phone: formData.get("phone"),
  };

  const parsed = cookProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  await supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name, phone: parsed.data.phone })
    .eq("id", user.id);

  const { error } = await supabase
    .from("cook_profiles")
    .update({
      cuisine_type: parsed.data.cuisine_type,
      description: parsed.data.description,
      pickup_address: parsed.data.pickup_address,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile", "page");
  return { success: true };
}

export async function createDish(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
  };

  const parsed = dishSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase.from("dishes").insert({
    cook_id: user.id,
    name: parsed.data.name,
    description: parsed.data.description || null,
    price: Math.round(parsed.data.price * 100), // convert to cents
    category: parsed.data.category,
  });

  if (error) return { error: error.message };

  revalidatePath("/menu", "page");
  return { success: true };
}

export async function updateDish(dishId: string, formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
  };

  const parsed = dishSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase
    .from("dishes")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: Math.round(parsed.data.price * 100),
      category: parsed.data.category,
    })
    .eq("id", dishId)
    .eq("cook_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/menu", "page");
  return { success: true };
}

export async function deleteDish(dishId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase
    .from("dishes")
    .delete()
    .eq("id", dishId)
    .eq("cook_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/menu", "page");
  return { success: true };
}

export async function toggleDishAvailability(dishId: string, isAvailable: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Не авторизован" };

  const { error } = await supabase
    .from("dishes")
    .update({ is_available: isAvailable })
    .eq("id", dishId)
    .eq("cook_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/menu", "page");
  return { success: true };
}
