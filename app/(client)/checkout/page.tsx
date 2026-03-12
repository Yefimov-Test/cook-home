import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/order/checkout-form";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Оформление заказа</h1>
      <CheckoutForm />
    </div>
  );
}
