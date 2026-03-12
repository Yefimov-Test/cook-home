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
