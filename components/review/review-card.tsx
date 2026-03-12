import { StarRating } from "./star-rating";

interface ReviewCardProps {
  rating: number;
  comment: string | null;
  clientName: string;
  createdAt: string;
}

export function ReviewCard({
  rating,
  comment,
  clientName,
  createdAt,
}: ReviewCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-2 rounded-lg border border-border/40 p-4">
      <StarRating value={rating} readonly size={16} />
      {comment && (
        <p className="text-sm text-foreground/80">{comment}</p>
      )}
      <p className="text-xs text-muted-foreground">
        — {clientName}, {formattedDate}
      </p>
    </div>
  );
}
