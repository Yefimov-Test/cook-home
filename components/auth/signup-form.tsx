"use client";

import { useActionState, useState, useEffect } from "react";
import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface City {
  id: string;
  name: string;
  country: string;
}

interface District {
  id: string;
  name: string;
}

export function SignupForm({ cities }: { cities: City[] }) {
  const [cityId, setCityId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    if (!cityId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }

    const supabase = createClient();
    supabase
      .from("districts")
      .select("id, name")
      .eq("city_id", cityId)
      .order("name")
      .then(({ data }) => {
        setDistricts(data ?? []);
        setDistrictId("");
      });
  }, [cityId]);

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await signup(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name">Имя</Label>
        <Input id="full_name" name="full_name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      <div className="space-y-2">
        <Label>Город</Label>
        <input type="hidden" name="city_id" value={cityId} />
        <Select value={cityId} onValueChange={(v) => setCityId(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите город" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id} label={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Район</Label>
        <input type="hidden" name="district_id" value={districtId} />
        <Select
          value={districtId}
          onValueChange={(v) => setDistrictId(v ?? "")}
          disabled={!cityId}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={cityId ? "Выберите район" : "Сначала выберите город"}
            />
          </SelectTrigger>
          <SelectContent>
            {districts.map((d) => (
              <SelectItem key={d.id} value={d.id} label={d.name}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Регистрация..." : "Создать аккаунт"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Войти
        </Link>
      </p>
    </form>
  );
}
