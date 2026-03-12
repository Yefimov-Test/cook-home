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
