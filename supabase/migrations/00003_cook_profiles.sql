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
