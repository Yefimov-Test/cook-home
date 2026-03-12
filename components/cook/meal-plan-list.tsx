"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { createMealPlan, deleteMealPlan, toggleMealPlanActive } from "@/actions/meal-plan";
import { toast } from "sonner";

const INTERVAL_LABELS: Record<string, string> = {
  daily: "Ежедневно",
  every_other_day: "Через день",
  weekly: "Еженедельно",
};

interface MealPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  includes: string | null;
  is_active: boolean;
}

export function MealPlanList({ plans: initialPlans }: { plans: MealPlan[] }) {
  const [showForm, setShowForm] = useState(false);
  const [interval, setInterval] = useState("");

  async function handleCreate(formData: FormData) {
    formData.set("interval", interval);
    const result = await createMealPlan(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Пакет создан");
      setShowForm(false);
      setInterval("");
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteMealPlan(id);
    if (result?.error) toast.error(result.error);
    else toast.success("Пакет удалён");
  }

  async function handleToggle(id: string, current: boolean) {
    const result = await toggleMealPlanActive(id, !current);
    if (result?.error) toast.error(result.error);
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Добавить пакет
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form action={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input id="name" name="name" placeholder="Семейные ужины" required />
                </div>
                <div>
                  <Label htmlFor="price">Цена за период (₽)</Label>
                  <Input id="price" name="price" type="number" step="1" min="1" required />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" name="description" rows={2} />
              </div>
              <div>
                <Label>Периодичность</Label>
                <input type="hidden" name="interval" value={interval} />
                <Select value={interval} onValueChange={(v) => setInterval(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите периодичность" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INTERVAL_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="includes">Что входит</Label>
                <Textarea id="includes" name="includes" rows={3} placeholder="5 ужинов в неделю: первое + второе + десерт" required />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Сохранить</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {initialPlans.length === 0 && !showForm ? (
        <p className="text-muted-foreground text-center py-8">
          У вас пока нет пакетов подписки. Создайте первый.
        </p>
      ) : (
        <div className="space-y-3">
          {initialPlans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{plan.name}</p>
                      <Badge variant="secondary">{INTERVAL_LABELS[plan.interval]}</Badge>
                      {!plan.is_active && <Badge variant="outline">Неактивен</Badge>}
                    </div>
                    {plan.description && <p className="text-sm text-muted-foreground mt-0.5">{plan.description}</p>}
                    {plan.includes && <p className="text-sm mt-1">{plan.includes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold whitespace-nowrap">{(plan.price / 100).toFixed(0)} ₽</span>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleToggle(plan.id, plan.is_active)}>
                      {plan.is_active ? "👁" : "🚫"}
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(plan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
