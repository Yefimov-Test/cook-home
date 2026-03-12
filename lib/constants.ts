export const PLATFORM_FEE_RATE = 0.15;

export const ORDER_STATUSES = [
  "new",
  "accepted",
  "cooking",
  "ready",
  "picked_up",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const SUBSCRIPTION_STATUSES = ["active", "paused", "cancelled"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const ROLES = ["client", "cook", "admin"] as const;
export type UserRole = (typeof ROLES)[number];

export const MEAL_PLAN_INTERVALS = ["daily", "every_other_day", "weekly"] as const;
export type MealPlanInterval = (typeof MEAL_PLAN_INTERVALS)[number];

export const CUISINE_TYPES = [
  "Русская",
  "Грузинская",
  "Узбекская",
  "Армянская",
  "Украинская",
  "Татарская",
  "Азиатская",
  "Европейская",
  "Итальянская",
  "Домашняя",
  "Другая",
] as const;

export const DISH_CATEGORIES = [
  "Первое",
  "Второе",
  "Салат",
  "Закуска",
  "Десерт",
  "Выпечка",
  "Напиток",
  "Другое",
] as const;
