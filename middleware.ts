import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    const { user, supabaseResponse, supabase } = await updateSession(request);
    const { pathname } = request.nextUrl;

    // Public routes — no auth required
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/become-a-cook") ||
      pathname.startsWith("/cooks/") ||
      pathname.startsWith("/api/") ||
      pathname === "/"
    ) {
      return supabaseResponse;
    }

    // Not authenticated → redirect to login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Get user role from profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? "client";

    // Role-based routing
    if (pathname.startsWith("/cook/")) {
      if (role !== "cook" && role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (pathname.startsWith("/admin")) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return supabaseResponse;
  } catch (e) {
    // If middleware fails (e.g. missing env vars), let the request through
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
