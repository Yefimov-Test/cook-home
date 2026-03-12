import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CookOrderList } from "@/components/cook/cook-order-list";

export default async function CookOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, dishes(name)), profiles!orders_client_id_fkey(full_name, phone)")
    .eq("cook_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Заказы</h1>
      <CookOrderList orders={orders ?? []} />
    </div>
  );
}
