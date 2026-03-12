"use server";

import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/validations/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data.user) {
    await supabase
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
        city_id: parsed.data.city_id,
        district_id: parsed.data.district_id || null,
      })
      .eq("id", data.user.id);
  }

  return NextResponse.json({ success: true });
}
