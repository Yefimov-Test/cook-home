import { ChefHat } from "lucide-react";
import { CookCard, type CookCardData } from "./cook-card";
import { EmptyState } from "@/components/shared/empty-state";

interface CookFeedProps {
  cooks: CookCardData[];
}

export function CookFeed({ cooks }: CookFeedProps) {
  if (cooks.length === 0) {
    return (
      <EmptyState
        icon={ChefHat}
        title="Поваров пока нет"
        description="Попробуйте изменить фильтры или загляните позже"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cooks.map((cook) => (
        <CookCard key={cook.id} cook={cook} />
      ))}
    </div>
  );
}
