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
