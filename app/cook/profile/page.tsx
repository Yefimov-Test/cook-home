import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CookProfileForm } from "@/components/cook/cook-profile-form";

export default async function CookProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: cookProfile } = await supabase
    .from("cook_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If no cook profile exists, show onboarding form
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {cookProfile ? "Редактирование профиля" : "Создание профиля повара"}
      </h1>
      <CookProfileForm
        profile={profile}
        cookProfile={cookProfile}
        isNew={!cookProfile}
      />
    </div>
  );
}
