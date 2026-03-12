import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CookProfileHeader } from "@/components/cook/cook-profile-header";
import { CookProfileTabs } from "./cook-profile-tabs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CookProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch cook profile
  const { data: cook } = await supabase
    .from("cook_profiles")
    .select(
      `
      id,
      slug,
      cuisine_type,
      description,
      avg_rating,
      total_reviews,
      cover_image_url,
      pickup_address,
      profile:profiles!inner(
        full_name,
        avatar_url,
        city:cities(name),
        district:districts(name)
      )
    `
    )
    .eq("slug", slug)
    .eq("is_approved", true)
    .eq("is_active", true)
    .single();

  if (!cook) notFound();

  // Fetch dishes, meal plans, reviews in parallel
  const [dishesRes, plansRes, reviewsRes] = await Promise.all([
    supabase
      .from("dishes")
      .select("id, name, description, price, category, image_url, is_available")
      .eq("cook_id", cook.id)
      .eq("is_available", true)
      .order("sort_order"),
    supabase
      .from("meal_plans")
      .select("id, name, description, price, interval, includes, image_url")
      .eq("cook_id", cook.id)
      .eq("is_active", true),
    supabase
      .from("reviews")
      .select(
        `
        id,
        rating,
        comment,
        created_at,
        client:profiles!reviews_client_id_fkey(full_name)
      `
      )
      .eq("cook_id", cook.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const cookData = {
    description: cook.description,
    cuisine_type: cook.cuisine_type ?? [],
    avg_rating: cook.avg_rating,
    total_reviews: cook.total_reviews ?? 0,
    cover_image_url: cook.cover_image_url,
    pickup_address: cook.pickup_address,
    profile: {
      full_name: (cook.profile as any).full_name,
      avatar_url: (cook.profile as any).avatar_url,
      city: (cook.profile as any).city,
      district: (cook.profile as any).district,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <CookProfileHeader cook={cookData} />
      <CookProfileTabs
        dishes={dishesRes.data ?? []}
        mealPlans={plansRes.data ?? []}
        reviews={(reviewsRes.data ?? []) as any}
      />
    </div>
  );
}
