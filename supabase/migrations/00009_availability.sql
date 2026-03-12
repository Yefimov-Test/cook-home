create table availability_slots (
  id uuid primary key default gen_random_uuid(),
  cook_id uuid not null references cook_profiles(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean default true
);

create index idx_availability_cook on availability_slots(cook_id);
