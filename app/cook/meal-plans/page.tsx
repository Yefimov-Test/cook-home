import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MealPlanList } from "@/components/cook/meal-plan-list";

export default async function MealPlansPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: plans } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("cook_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Пакеты подписок</h1>
      <MealPlanList plans={plans ?? []} />
    </div>
  );
}
