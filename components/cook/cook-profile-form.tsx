"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createCookProfile, updateCookProfile } from "@/actions/cook";
import { CUISINE_TYPES } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  profile: any;
  cookProfile: any;
  isNew: boolean;
}

export function CookProfileForm({ profile, cookProfile, isNew }: Props) {
  const router = useRouter();
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(
    cookProfile?.cuisine_type ?? []
  );

  function toggleCuisine(cuisine: string) {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  }

  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    selectedCuisines.forEach((c) => formData.append("cuisine_type", c));

    const action = isNew ? createCookProfile : updateCookProfile;
    const result = await action(formData);
    setSaving(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(isNew ? "Профиль создан!" : "Профиль обновлён");
      if (isNew) router.push("/cook/dashboard");
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Имя</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name ?? ""}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={profile?.phone ?? ""}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">О себе</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={cookProfile?.description ?? ""}
              rows={3}
              placeholder="Расскажите о себе, вашем опыте и стиле готовки"
              required
            />
          </div>

          <div>
            <Label htmlFor="pickup_address">Адрес самовывоза</Label>
            <Input
              id="pickup_address"
              name="pickup_address"
              defaultValue={cookProfile?.pickup_address ?? ""}
              placeholder="ул. Примерная, д. 1, подъезд 2"
              required
            />
          </div>

          <div>
            <Label className="mb-2 block">Тип кухни</Label>
            <div className="flex flex-wrap gap-2">
              {CUISINE_TYPES.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={selectedCuisines.includes(cuisine) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCuisine(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Сохранение..." : isNew ? "Создать профиль" : "Сохранить"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
