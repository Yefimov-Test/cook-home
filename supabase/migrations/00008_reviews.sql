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
