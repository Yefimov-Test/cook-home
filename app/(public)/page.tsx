import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, MapPin, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CookFeed } from "@/components/cook/cook-feed";
import { Filters } from "@/components/shared/filters";
import type { CookCardData } from "@/components/cook/cook-card";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function CatalogSection({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const supabase = await createClient();

  // Fetch cities for filter dropdown
  const { data: cities } = await supabase
    .from("cities")
    .select("id, name")
    .order("name");

  // Build cook query
  let query = supabase
    .from("cook_profiles")
    .select(
      `
      id,
      slug,
      cuisine_type,
      description,
      avg_rating,
      total_reviews,
      profile:profiles!inner(
        full_name,
        avatar_url,
        city_id,
        district_id,
        district:districts(name)
      )
    `
    )
    .eq("is_approved", true)
    .eq("is_active", true)
    .order("avg_rating", { ascending: false, nullsFirst: false });

  // Apply filters
  if (searchParams.cuisine) {
    query = query.contains("cuisine_type", [searchParams.cuisine]);
  }
  if (searchParams.city) {
    query = query.eq("profiles.city_id", searchParams.city);
  }
  if (searchParams.district) {
    query = query.eq("profiles.district_id", searchParams.district);
  }

  const { data: rawCooks } = await query;

  const cooks: CookCardData[] = (rawCooks ?? []).map((c: any) => ({
    id: c.id,
    slug: c.slug,
    cuisine_type: c.cuisine_type ?? [],
    description: c.description,
    avg_rating: c.avg_rating,
    total_reviews: c.total_reviews ?? 0,
    profile: {
      full_name: c.profile.full_name,
      avatar_url: c.profile.avatar_url,
      district: c.profile.district,
    },
  }));

  return (
    <>
      <Filters cities={cities ?? []} />
      <div className="mt-6">
        <CookFeed cooks={cooks} />
      </div>
    </>
  );
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Домашняя еда
            <br />
            <span className="text-primary">рядом с вами</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
            Повара по соседству готовят для вас. Выберите блюда, закажите и
            заберите.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" render={<Link href="#catalog" />}>
              Найти повара
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/become-a-cook" />}
            >
              Стать поваром
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Как это работает
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Найдите повара",
                desc: "Выберите повара в вашем районе по типу кухни и рейтингу",
              },
              {
                icon: UtensilsCrossed,
                title: "Закажите еду",
                desc: "Выберите блюда из меню и оформите заказ",
              },
              {
                icon: Star,
                title: "Заберите и оцените",
                desc: "Заберите заказ в назначенное время и оставьте отзыв",
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Домашняя еда от лучших поваров
          </h2>
          <Suspense
            fallback={
              <div className="text-muted-foreground py-8 text-center">
                Загрузка...
              </div>
            }
          >
            <CatalogSection searchParams={params} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
