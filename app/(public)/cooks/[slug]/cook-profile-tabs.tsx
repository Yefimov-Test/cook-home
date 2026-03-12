"use client";

import { Star, UtensilsCrossed, Package, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DishCard, type DishCardData } from "@/components/cook/dish-card";
import {
  MealPlanCard,
  type MealPlanCardData,
} from "@/components/cook/meal-plan-card";
import { EmptyState } from "@/components/shared/empty-state";

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  client: { full_name: string } | null;
}

interface CookProfileTabsProps {
  dishes: DishCardData[];
  mealPlans: MealPlanCardData[];
  reviews: ReviewData[];
}

export function CookProfileTabs({
  dishes,
  mealPlans,
  reviews,
}: CookProfileTabsProps) {
  return (
    <Tabs defaultValue={0}>
      <TabsList>
        <TabsTrigger value={0}>
          <UtensilsCrossed className="size-4 mr-1.5" />
          Меню
        </TabsTrigger>
        <TabsTrigger value={1}>
          <Package className="size-4 mr-1.5" />
          Подписки
        </TabsTrigger>
        <TabsTrigger value={2}>
          <MessageSquare className="size-4 mr-1.5" />
          Отзывы
        </TabsTrigger>
      </TabsList>

      {/* Меню */}
      <TabsContent value={0}>
        {dishes.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Меню пока пусто"
            description="Повар ещё не добавил блюда"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Подписки */}
      <TabsContent value={1}>
        {mealPlans.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Подписок пока нет"
            description="Повар ещё не создал планы питания"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealPlans.map((plan) => (
              <MealPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Отзывы */}
      <TabsContent value={2}>
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Отзывов пока нет"
            description="Будьте первым, кто оставит отзыв"
          />
        ) : (
          <div className="space-y-4 max-w-2xl">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

function ReviewItem({ review }: { review: ReviewData }) {
  const date = new Date(review.created_at).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {review.client?.full_name ?? "Клиент"}
          </span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-4 ${
                i < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      )}
    </div>
  );
}
