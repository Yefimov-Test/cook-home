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
