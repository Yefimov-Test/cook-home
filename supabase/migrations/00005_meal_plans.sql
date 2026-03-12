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
