import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrderCard } from "@/components/order/order-card";
import type { OrderStatus } from "@/lib/constants";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total_amount,
      platform_fee,
      pickup_date,
      pickup_time,
      payment_intent_id,
      created_at,
      cook_profiles (
        pickup_address,
        profiles (full_name, phone)
      ),
      order_items (
        id,
        quantity,
        price,
        dishes (name)
      )
    `
    )
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Мои заказы</h1>
      {!orders || orders.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          У вас пока нет заказов
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={
                order as unknown as {
                  id: string;
                  status: OrderStatus;
                  total_amount: number;
                  platform_fee: number;
                  pickup_date: string;
                  pickup_time: string;
                  payment_intent_id: string | null;
                  created_at: string;
                  cook_profiles: {
                    pickup_address: string | null;
                    profiles: {
                      full_name: string;
                      phone: string | null;
                    } | null;
                  } | null;
                  order_items: {
                    id: string;
                    quantity: number;
                    price: number;
                    dishes: { name: string } | null;
                  }[];
                }
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
