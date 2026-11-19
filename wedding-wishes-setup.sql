begin;

create table public.wedding_wishes (
  id bigint generated always as identity primary key,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  message text not null check (char_length(btrim(message)) between 1 and 1000)
);

alter table public.wedding_wishes enable row level security;
revoke all on public.wedding_wishes from public, anon, authenticated;
grant select on public.wedding_wishes to anon;
grant insert (name, message) on public.wedding_wishes to anon;

create policy "Guests can read wishes" on public.wedding_wishes
  for select to anon using (true);

create policy "Guests can submit wishes" on public.wedding_wishes
  for insert to anon with check (true);

commit;
