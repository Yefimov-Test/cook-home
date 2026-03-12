import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DishList } from "@/components/cook/dish-list";

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: dishes } = await supabase
    .from("dishes")
    .select("*")
    .eq("cook_id", user.id)
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Меню</h1>
      <DishList dishes={dishes ?? []} />
    </div>
  );
}
