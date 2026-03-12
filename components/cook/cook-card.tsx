"use client";

import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface CookCardData {
  id: string;
  slug: string;
  cuisine_type: string[];
  description: string | null;
  avg_rating: number | null;
  total_reviews: number;
  profile: {
    full_name: string;
    avatar_url: string | null;
    district: { name: string } | null;
  };
}

export function CookCard({ cook }: { cook: CookCardData }) {
  const initials = cook.profile.full_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/cooks/${cook.slug}`} className="block group">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="size-12">
              <AvatarImage src={cook.profile.avatar_url ?? undefined} alt={cook.profile.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                {cook.profile.full_name}
              </h3>
              {cook.profile.district && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="size-3" />
                  {cook.profile.district.name}
                </p>
              )}
            </div>
            {cook.avg_rating != null && cook.avg_rating > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium shrink-0">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {cook.avg_rating.toFixed(1)}
              </div>
            )}
          </div>

          {cook.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {cook.description}
            </p>
          )}

          {cook.cuisine_type.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {cook.cuisine_type.slice(0, 3).map((cuisine) => (
                <Badge key={cuisine} variant="secondary" className="text-xs">
                  {cuisine}
                </Badge>
              ))}
              {cook.cuisine_type.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{cook.cuisine_type.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
