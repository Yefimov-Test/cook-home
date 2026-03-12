import { z } from "zod";

export const reviewSchema = z.object({
  orderId: z.string().uuid("Некорректный ID заказа"),
  cookId: z.string().uuid("Некорректный ID кулинара"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Минимальная оценка — 1")
    .max(5, "Максимальная оценка — 5"),
  comment: z
    .string()
    .max(500, "Комментарий не может быть длиннее 500 символов")
    .optional()
    .default(""),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
