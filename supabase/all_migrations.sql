create table cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null
);

create table districts (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  name text not null
);

create index idx_districts_city_id on districts(city_id);

-- Seed: Russia
insert into cities (id, name, country) values
  ('a0000000-0000-0000-0000-000000000001', 'Москва', 'RU'),
  ('a0000000-0000-0000-0000-000000000002', 'Санкт-Петербург', 'RU'),
  ('a0000000-0000-0000-0000-000000000003', 'Казань', 'RU');

-- Seed: Spain
insert into cities (id, name, country) values
  ('a0000000-0000-0000-0000-000000000004', 'Barcelona', 'ES'),
  ('a0000000-0000-0000-0000-000000000005', 'Madrid', 'ES');

-- Moscow districts
insert into districts (city_id, name) values
  ('a0000000-0000-0000-0000-000000000001', 'Центральный'),
  ('a0000000-0000-0000-0000-000000000001', 'Северный'),
  ('a0000000-0000-0000-0000-000000000001', 'Южный'),
  ('a0000000-0000-0000-0000-000000000001', 'Восточный'),
  ('a0000000-0000-0000-0000-000000000001', 'Западный'),
  ('a0000000-0000-0000-0000-000000000001', 'Северо-Восточный'),
  ('a0000000-0000-0000-0000-000000000001', 'Юго-Восточный'),
  ('a0000000-0000-0000-0000-000000000001', 'Юго-Западный'),
  ('a0000000-0000-0000-0000-000000000001', 'Северо-Западный');

-- SPb districts
insert into districts (city_id, name) values
  ('a0000000-0000-0000-0000-000000000002', 'Центральный'),
  ('a0000000-0000-0000-0000-000000000002', 'Адмиралтейский'),
  ('a0000000-0000-0000-0000-000000000002', 'Василеостровский'),
  ('a0000000-0000-0000-0000-000000000002', 'Петроградский'),
  ('a0000000-0000-0000-0000-000000000002', 'Московский');

-- Kazan districts
insert into districts (city_id, name) values
  ('a0000000-0000-0000-0000-000000000003', 'Вахитовский'),
  ('a0000000-0000-0000-0000-000000000003', 'Ново-Савиновский'),
  ('a0000000-0000-0000-0000-000000000003', 'Советский'),
  ('a0000000-0000-0000-0000-000000000003', 'Приволжский');

-- Barcelona districts
insert into districts (city_id, name) values
  ('a0000000-0000-0000-0000-000000000004', 'Eixample'),
  ('a0000000-0000-0000-0000-000000000004', 'Gràcia'),
  ('a0000000-0000-0000-0000-000000000004', 'Ciutat Vella'),
  ('a0000000-0000-0000-0000-000000000004', 'Sant Martí'),
  ('a0000000-0000-0000-0000-000000000004', 'Sants-Montjuïc');

-- Madrid districts
insert into districts (city_id, name) values
  ('a0000000-0000-0000-0000-000000000005', 'Centro'),
  ('a0000000-0000-0000-0000-000000000005', 'Salamanca'),
  ('a0000000-0000-0000-0000-000000000005', 'Chamberí'),
  ('a0000000-0000-0000-0000-000000000005', 'Retiro'),
  ('a0000000-0000-0000-0000-000000000005', 'Chamartín');

-- RLS: everyone can read cities and districts
alter table cities enable row level security;
alter table districts enable row level security;

create policy "cities_read" on cities for select using (true);
create policy "districts_read" on districts for select using (true);
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('client', 'cook', 'admin')),
  full_name text,
  phone text,
  city_id uuid references cities(id),
  district_id uuid references districts(id),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_profiles_role on profiles(role);
create index idx_profiles_city on profiles(city_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();
create table cook_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  slug text unique not null,
  cuisine_type text[] default '{}',
  description text,
  pickup_address text,
  cover_image_url text,
  is_approved boolean default false,
  is_active boolean default true,
  avg_rating numeric(2,1) default 0,
  total_reviews int default 0,
  created_at timestamptz default now()
);

create index idx_cook_profiles_slug on cook_profiles(slug);
create index idx_cook_profiles_approved on cook_profiles(is_approved) where is_approved = true;
create table dishes (
  id uuid primary key default gen_random_uuid(),
  cook_id uuid not null references cook_profiles(id) on delete cascade,
  name text not null,
  description text,
  price int not null,
  category text,
  image_url text,
  is_available boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index idx_dishes_cook_id on dishes(cook_id);
create table meal_plans (
  id uuid primary key default gen_random_uuid(),
  cook_id uuid not null references cook_profiles(id) on delete cascade,
  name text not null,
  description text,
  price int not null,
  interval text not null check (interval in ('daily', 'every_other_day', 'weekly')),
  includes text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index idx_meal_plans_cook_id on meal_plans(cook_id);
create table orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id),
  cook_id uuid not null references cook_profiles(id),
  status text not null default 'new' check (status in ('new', 'accepted', 'cooking', 'ready', 'picked_up', 'cancelled')),
  total_amount int not null,
  platform_fee int not null,
  pickup_date date not null,
  pickup_time text not null,
  payment_intent_id text,
  payment_provider text default 'mock' check (payment_provider in ('mock', 'stripe', 'yookassa')),
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  dish_id uuid not null references dishes(id),
  quantity int not null default 1,
  price int not null
);

create index idx_orders_client on orders(client_id);
create index idx_orders_cook on orders(cook_id);
create index idx_orders_status on orders(status);
create index idx_order_items_order on order_items(order_id);

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id),
  cook_id uuid not null references cook_profiles(id),
  meal_plan_id uuid not null references meal_plans(id),
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
  payment_id text,
  preferred_days int[] default '{}',
  preferred_time text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

create index idx_subscriptions_client on subscriptions(client_id);
create index idx_subscriptions_cook on subscriptions(cook_id);
create index idx_subscriptions_status on subscriptions(status) where status = 'active';
create table reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) unique,
  client_id uuid not null references profiles(id),
  cook_id uuid not null references cook_profiles(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create index idx_reviews_cook on reviews(cook_id);

-- Trigger to recalculate avg_rating on cook_profiles
create or replace function recalculate_cook_rating()
returns trigger as $$
begin
  update cook_profiles
  set
    avg_rating = coalesce((select round(avg(rating)::numeric, 1) from reviews where cook_id = coalesce(new.cook_id, old.cook_id)), 0),
    total_reviews = (select count(*) from reviews where cook_id = coalesce(new.cook_id, old.cook_id))
  where id = coalesce(new.cook_id, old.cook_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger reviews_rating_update
  after insert or update or delete on reviews
  for each row execute function recalculate_cook_rating();
create table availability_slots (
  id uuid primary key default gen_random_uuid(),
  cook_id uuid not null references cook_profiles(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean default true
);

create index idx_availability_cook on availability_slots(cook_id);
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
-- Create storage buckets
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('dishes', 'dishes', true);
insert into storage.buckets (id, name, public) values ('covers', 'covers', true);

-- Storage policies: anyone can read, authenticated users can upload their own
create policy "avatars_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_insert" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid() is not null);
create policy "avatars_update" on storage.objects for update using (bucket_id = 'avatars' and auth.uid() is not null);

create policy "dishes_read" on storage.objects for select using (bucket_id = 'dishes');
create policy "dishes_insert" on storage.objects for insert with check (bucket_id = 'dishes' and auth.uid() is not null);
create policy "dishes_update" on storage.objects for update using (bucket_id = 'dishes' and auth.uid() is not null);

create policy "covers_read" on storage.objects for select using (bucket_id = 'covers');
create policy "covers_insert" on storage.objects for insert with check (bucket_id = 'covers' and auth.uid() is not null);
create policy "covers_update" on storage.objects for update using (bucket_id = 'covers' and auth.uid() is not null);
