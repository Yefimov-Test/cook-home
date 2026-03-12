import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CookSidebar } from "@/components/layout/cook-sidebar";

export default async function CookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <CookSidebar />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
