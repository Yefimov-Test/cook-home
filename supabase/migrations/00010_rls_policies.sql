-- profiles
alter table profiles enable row level security;
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- cook_profiles
alter table cook_profiles enable row level security;
create policy "cook_profiles_select" on cook_profiles for select using (true);
create policy "cook_profiles_insert" on cook_profiles for insert with check (auth.uid() = id);
create policy "cook_profiles_update" on cook_profiles for update using (auth.uid() = id);

-- dishes
alter table dishes enable row level security;
create policy "dishes_select" on dishes for select using (true);
create policy "dishes_insert" on dishes for insert with check (
  auth.uid() = cook_id
);
create policy "dishes_update" on dishes for update using (
  auth.uid() = cook_id
);
create policy "dishes_delete" on dishes for delete using (
  auth.uid() = cook_id
);

-- meal_plans
alter table meal_plans enable row level security;
create policy "meal_plans_select" on meal_plans for select using (true);
create policy "meal_plans_insert" on meal_plans for insert with check (auth.uid() = cook_id);
create policy "meal_plans_update" on meal_plans for update using (auth.uid() = cook_id);
create policy "meal_plans_delete" on meal_plans for delete using (auth.uid() = cook_id);

-- orders
alter table orders enable row level security;
create policy "orders_select_client" on orders for select using (auth.uid() = client_id);
create policy "orders_select_cook" on orders for select using (auth.uid() = cook_id);
create policy "orders_insert" on orders for insert with check (auth.uid() = client_id);
create policy "orders_update_cook" on orders for update using (auth.uid() = cook_id);

-- order_items
alter table order_items enable row level security;
create policy "order_items_select" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and (orders.client_id = auth.uid() or orders.cook_id = auth.uid()))
);
create policy "order_items_insert" on order_items for insert with check (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.client_id = auth.uid())
);

-- subscriptions
alter table subscriptions enable row level security;
create policy "subscriptions_select_client" on subscriptions for select using (auth.uid() = client_id);
create policy "subscriptions_select_cook" on subscriptions for select using (auth.uid() = cook_id);
create policy "subscriptions_insert" on subscriptions for insert with check (auth.uid() = client_id);
create policy "subscriptions_update_client" on subscriptions for update using (auth.uid() = client_id);
create policy "subscriptions_update_cook" on subscriptions for update using (auth.uid() = cook_id);

-- reviews
alter table reviews enable row level security;
create policy "reviews_select" on reviews for select using (true);
create policy "reviews_insert" on reviews for insert with check (auth.uid() = client_id);

-- availability_slots
alter table availability_slots enable row level security;
create policy "availability_select" on availability_slots for select using (true);
create policy "availability_insert" on availability_slots for insert with check (auth.uid() = cook_id);
create policy "availability_update" on availability_slots for update using (auth.uid() = cook_id);
create policy "availability_delete" on availability_slots for delete using (auth.uid() = cook_id);

-- Admin override: admin can do everything
-- We use service role key for admin operations, so no RLS policy needed for admin role
