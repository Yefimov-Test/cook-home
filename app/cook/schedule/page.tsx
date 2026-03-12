import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ScheduleEditor } from "@/components/cook/schedule-editor";

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: slots } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("cook_id", user.id)
    .order("day_of_week");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Расписание</h1>
      <ScheduleEditor slots={slots ?? []} />
    </div>
  );
}
