"use client";

import { useActionState, useState } from "react";
import { createReview } from "@/actions/review";
import { StarRating } from "./star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReviewFormProps {
  orderId: string;
  cookId: string;
}

export function ReviewForm({ orderId, cookId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [state, action, isPending] = useActionState(createReview, null);

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
        Спасибо за ваш отзыв!
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="cookId" value={cookId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="space-y-2">
        <Label>Оценка</Label>
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Комментарий (необязательно)</Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Расскажите о вашем опыте..."
          maxLength={500}
          rows={3}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={isPending || rating === 0}>
        {isPending ? "Отправка..." : "Оставить отзыв"}
      </Button>
    </form>
  );
}
