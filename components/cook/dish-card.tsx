"use client";

import Image from "next/image";
import { ShoppingCart, UtensilsCrossed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface DishCardData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  is_available: boolean;
}

export function DishCard({ dish }: { dish: DishCardData }) {
  const priceRubles = dish.price / 100;

  return (
    <Card className="h-full overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        {dish.image_url ? (
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <UtensilsCrossed className="size-10 text-muted-foreground/40" />
          </div>
        )}
        {dish.category && (
          <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
            {dish.category}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-1">{dish.name}</h3>
        {dish.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {dish.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-primary">
            {priceRubles} ₽
          </span>
          <Button
            size="sm"
            disabled={!dish.is_available}
            onClick={() => {
              // TODO: connect to cart
            }}
          >
            <ShoppingCart className="size-4 mr-1" />
            В корзину
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
