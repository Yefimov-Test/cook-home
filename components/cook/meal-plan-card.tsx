"use client";

import { CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface MealPlanCardData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  includes: string[] | null;
  image_url: string | null;
}

const INTERVAL_LABELS: Record<string, string> = {
  daily: "Ежедневно",
  every_other_day: "Через день",
  weekly: "Еженедельно",
};

export function MealPlanCard({ plan }: { plan: MealPlanCardData }) {
  const priceRubles = plan.price / 100;
  const intervalLabel = INTERVAL_LABELS[plan.interval] ?? plan.interval;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          <Badge variant="outline" className="shrink-0">
            {intervalLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {plan.description && (
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        )}

        {plan.includes && plan.includes.length > 0 && (
          <ul className="text-sm space-y-1">
            {plan.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CalendarCheck className="size-4 text-primary mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">
            {priceRubles} ₽
          </span>
          <Button
            size="sm"
            onClick={() => {
              // TODO: connect to subscription flow
            }}
          >
            Подписаться
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
