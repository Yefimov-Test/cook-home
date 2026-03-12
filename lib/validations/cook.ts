import { z } from "zod";

export const cookProfileSchema = z.object({
  full_name: z.string().min(2, "Введите имя"),
  description: z.string().min(10, "Опишите себя (минимум 10 символов)"),
  cuisine_type: z.array(z.string()).min(1, "Выберите хотя бы один тип кухни"),
  pickup_address: z.string().min(5, "Введите адрес самовывоза"),
  phone: z.string().min(5, "Введите телефон"),
});

export const dishSchema = z.object({
  name: z.string().min(2, "Введите название блюда"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Укажите цену"),
  category: z.string().min(1, "Выберите категорию"),
});

export const mealPlanSchema = z.object({
  name: z.string().min(2, "Введите название"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Укажите цену"),
  interval: z.enum(["daily", "every_other_day", "weekly"]),
  includes: z.string().min(5, "Опишите что входит в пакет"),
});

export type CookProfileInput = z.infer<typeof cookProfileSchema>;
export type DishInput = z.infer<typeof dishSchema>;
export type MealPlanInput = z.infer<typeof mealPlanSchema>;
