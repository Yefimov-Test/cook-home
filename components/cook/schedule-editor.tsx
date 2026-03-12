"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAvailability } from "@/actions/schedule";
import { toast } from "sonner";

const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

interface Slot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export function ScheduleEditor({ slots: initialSlots }: { slots: Slot[] }) {
  const [slots, setSlots] = useState<Record<number, { start_time: string; end_time: string; is_active: boolean }>>(
    () => {
      const map: Record<number, { start_time: string; end_time: string; is_active: boolean }> = {};
      initialSlots.forEach((s) => {
        map[s.day_of_week] = {
          start_time: s.start_time.slice(0, 5),
          end_time: s.end_time.slice(0, 5),
          is_active: s.is_active,
        };
      });
      return map;
    }
  );

  function toggleDay(day: number) {
    setSlots((prev) => {
      if (prev[day]) {
        const updated = { ...prev };
        updated[day] = { ...updated[day], is_active: !updated[day].is_active };
        return updated;
      }
      return { ...prev, [day]: { start_time: "12:00", end_time: "18:00", is_active: true } };
    });
  }

  function updateTime(day: number, field: "start_time" | "end_time", value: string) {
    setSlots((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  async function handleSave() {
    const slotsArray = Object.entries(slots)
      .filter(([, s]) => s.is_active)
      .map(([day, s]) => ({
        day_of_week: Number(day),
        start_time: s.start_time,
        end_time: s.end_time,
        is_active: true,
      }));

    const result = await updateAvailability(slotsArray);
    if (result?.error) toast.error(result.error);
    else toast.success("Расписание сохранено");
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {DAYS.map((dayName, i) => {
            const slot = slots[i];
            const isActive = slot?.is_active ?? false;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleDay(i)}
                      className="rounded"
                    />
                    <span className="text-sm">{dayName}</span>
                  </Label>
                </div>
                {isActive && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={slot?.start_time ?? "12:00"}
                      onChange={(e) => updateTime(i, "start_time", e.target.value)}
                      className="w-28"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="time"
                      value={slot?.end_time ?? "18:00"}
                      onChange={(e) => updateTime(i, "end_time", e.target.value)}
                      className="w-28"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Button onClick={handleSave} className="mt-6">
          Сохранить расписание
        </Button>
      </CardContent>
    </Card>
  );
}
