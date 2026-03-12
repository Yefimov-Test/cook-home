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
