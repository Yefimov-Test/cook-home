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
import { createDish, deleteDish, toggleDishAvailability } from "@/actions/cook";
import { DISH_CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";

interface Dish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  is_available: boolean;
}

export function DishList({ dishes: initialDishes }: { dishes: Dish[] }) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");

  async function handleCreate(formData: FormData) {
    formData.set("category", category);
    const result = await createDish(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Блюдо добавлено");
      setShowForm(false);
      setCategory("");
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteDish(id);
    if (result?.error) toast.error(result.error);
    else toast.success("Блюдо удалено");
  }

  async function handleToggle(id: string, current: boolean) {
    const result = await toggleDishAvailability(id, !current);
    if (result?.error) toast.error(result.error);
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Добавить блюдо
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form action={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="price">Цена (₽)</Label>
                  <Input id="price" name="price" type="number" step="1" min="1" required />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" name="description" rows={2} />
              </div>
              <div>
                <Label>Категория</Label>
                <input type="hidden" name="category" value={category} />
                <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISH_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      {initialDishes.length === 0 && !showForm ? (
        <p className="text-muted-foreground text-center py-8">
          У вас пока нет блюд. Добавьте первое блюдо в меню.
        </p>
      ) : (
        <div className="space-y-3">
          {initialDishes.map((dish) => (
            <Card key={dish.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{dish.name}</p>
                    {dish.category && <Badge variant="secondary">{dish.category}</Badge>}
                    {!dish.is_available && <Badge variant="outline">Скрыто</Badge>}
                  </div>
                  {dish.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">{dish.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{(dish.price / 100).toFixed(0)} ₽</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleToggle(dish.id, dish.is_available)}
                  >
                    {dish.is_available ? "👁" : "🚫"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(dish.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
