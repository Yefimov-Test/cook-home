import { z } from "zod";

export const checkoutSchema = z.object({
  cookId: z.string().uuid("Неверный ID повара"),
  items: z.string().min(1, "Корзина пуста"),
  pickupDate: z.string().min(1, "Выберите дату"),
  pickupTime: z.string().min(1, "Выберите время"),
});

export const subscriptionSchema = z.object({
  mealPlanId: z.string().uuid("Неверный ID плана"),
  preferredDays: z
    .array(z.number().min(0).max(6))
    .min(1, "Выберите хотя бы один день"),
  preferredTime: z.string().min(1, "Выберите время"),
});
