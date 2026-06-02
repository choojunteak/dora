create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id) on delete cascade,
  addressee_id uuid not null references profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id)
);

create table if not exists food_lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  privacy text not null default 'friends' check (privacy in ('private', 'friends', 'public')),
  created_at timestamptz not null default now()
);

create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  postal_code text,
  latitude double precision not null,
  longitude double precision not null,
  normalized_key text unique,
  created_at timestamptz not null default now()
);

create table if not exists saved_places (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references food_lists(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  note text,
  status text not null default 'want_to_try' check (status in ('want_to_try', 'tried', 'favourite')),
  rating numeric(2, 1) check (rating >= 0 and rating <= 5),
  price_range text check (price_range in ('$', '$$', '$$$', '$$$$')),
  created_at timestamptz not null default now(),
  unique (list_id, place_id, user_id)
);

create table if not exists place_tags (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  tag text not null,
  tag_type text not null check (tag_type in ('category', 'mood')),
  unique (place_id, tag, tag_type)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists place_sources (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  source_type text not null check (source_type in ('tiktok', 'instagram', 'manual', 'other')),
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_places_lat_lng on places(latitude, longitude);
create index if not exists idx_food_lists_owner_id on food_lists(owner_id);
create index if not exists idx_saved_places_list_id on saved_places(list_id);
create index if not exists idx_saved_places_place_id on saved_places(place_id);
create index if not exists idx_place_tags_place_id on place_tags(place_id);
create index if not exists idx_place_tags_place_id_tag on place_tags(place_id, tag);
create index if not exists idx_comments_place_id on comments(place_id);
create index if not exists idx_place_sources_place_id on place_sources(place_id);

-- Suggested RLS direction for later:
-- alter table profiles enable row level security;
-- alter table friendships enable row level security;
-- alter table food_lists enable row level security;
-- alter table places enable row level security;
-- alter table saved_places enable row level security;
-- alter table place_tags enable row level security;
-- alter table comments enable row level security;
-- alter table place_sources enable row level security;
--
-- Policy ideas:
-- 1. Users can read public lists.
-- 2. Users can read friends-only lists when an accepted friendship exists.
-- 3. Users can insert/update/delete their own lists and saved_places rows.
-- 4. Places can be read by authenticated users and inserted by authenticated users.
-- 5. Comments can be managed by their author.
-- 6. Service-role-only maintenance should stay server-side and never use the anon key.
