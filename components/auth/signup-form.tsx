"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const form = e.currentTarget;
    const body = {
      full_name: (form.elements.namedItem("full_name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      city_id: cityId,
      district_id: districtId,
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Ошибка регистрации");
        setIsPending(false);
        return;
      }

      router.push("/");
    } catch {
      setError("Ошибка сети");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
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
        <Label htmlFor="city_id">Город</Label>
        <select
          id="city_id"
          name="city_id"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Выберите город</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="district_id">Район</Label>
        <select
          id="district_id"
          name="district_id"
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          disabled={!cityId}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {cityId ? "Выберите район" : "Сначала выберите город"}
          </option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Регистрация..." : "Создать аккаунт"}
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
