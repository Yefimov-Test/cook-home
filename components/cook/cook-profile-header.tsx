"use client";

import { Star, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CookProfileHeaderProps {
  cook: {
    description: string | null;
    cuisine_type: string[];
    avg_rating: number | null;
    total_reviews: number;
    cover_image_url: string | null;
    pickup_address: string | null;
    profile: {
      full_name: string;
      avatar_url: string | null;
      city: { name: string } | null;
      district: { name: string } | null;
    };
  };
}

export function CookProfileHeader({ cook }: CookProfileHeaderProps) {
  const initials = cook.profile.full_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const location = [cook.profile.city?.name, cook.profile.district?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-4">
      {/* Cover */}
      {cook.cover_image_url && (
        <div
          className="h-48 md:h-64 rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${cook.cover_image_url})` }}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Avatar className="size-20 border-4 border-background shadow-md">
          <AvatarImage
            src={cook.profile.avatar_url ?? undefined}
            alt={cook.profile.full_name}
          />
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            {cook.profile.full_name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {cook.avg_rating != null && cook.avg_rating > 0 && (
              <span className="flex items-center gap-1 text-foreground font-medium">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {cook.avg_rating.toFixed(1)}
                <span className="text-muted-foreground font-normal">
                  ({cook.total_reviews}{" "}
                  {pluralReviews(cook.total_reviews)})
                </span>
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {location}
              </span>
            )}
          </div>

          {cook.cuisine_type.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cook.cuisine_type.map((c) => (
                <Badge key={c} variant="secondary">
                  {c}
                </Badge>
              ))}
            </div>
          )}

          {cook.description && (
            <p className="text-muted-foreground max-w-2xl">
              {cook.description}
            </p>
          )}

          {cook.pickup_address && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Самовывоз:</span>{" "}
              {cook.pickup_address}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function pluralReviews(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "отзыв";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "отзыва";
  return "отзывов";
}
