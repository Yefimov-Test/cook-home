"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CUISINE_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { X } from "lucide-react";

interface City {
  id: string;
  name: string;
}

interface District {
  id: string;
  name: string;
}

interface FiltersProps {
  cities: City[];
}

export function Filters({ cities }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCuisine = searchParams.get("cuisine") ?? "";
  const currentCity = searchParams.get("city") ?? "";
  const currentDistrict = searchParams.get("district") ?? "";

  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset district when city changes
      if (key === "city") {
        params.delete("district");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  // Fetch districts when city changes
  useEffect(() => {
    if (!currentCity) {
      setDistricts([]);
      return;
    }

    setLoadingDistricts(true);
    const supabase = createClient();
    supabase
      .from("districts")
      .select("id, name")
      .eq("city_id", currentCity)
      .order("name")
      .then(({ data }) => {
        setDistricts(data ?? []);
        setLoadingDistricts(false);
      });
  }, [currentCity]);

  const hasFilters = currentCuisine || currentCity || currentDistrict;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={currentCuisine || undefined}
        onValueChange={(v) => updateParams("cuisine", v ?? "")}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Тип кухни" />
        </SelectTrigger>
        <SelectContent>
          {CUISINE_TYPES.map((cuisine) => (
            <SelectItem key={cuisine} value={cuisine}>
              {cuisine}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentCity || undefined}
        onValueChange={(v) => updateParams("city", v ?? "")}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Город" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentCity && districts.length > 0 && (
        <Select
          value={currentDistrict || undefined}
          onValueChange={(v) => updateParams("district", v ?? "")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue
              placeholder={loadingDistricts ? "Загрузка..." : "Район"}
            />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="size-3 mr-1" />
          Сбросить
        </Button>
      )}
    </div>
  );
}
