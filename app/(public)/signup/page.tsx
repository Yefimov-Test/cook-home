import { SignupForm } from "@/components/auth/signup-form";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const { data: cities } = await supabase
    .from("cities")
    .select("id, name, country")
    .order("name");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Регистрация</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Создайте аккаунт и начните заказывать
          </p>
        </div>
        <SignupForm cities={cities ?? []} />
      </div>
    </div>
  );
}
