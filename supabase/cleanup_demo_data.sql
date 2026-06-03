begin;

-- Local/staging/testing cleanup only. Do not run this against production.
--
-- Demo/test profiles are marked with public.profiles.is_demo = true.
-- Delete the matching Auth users so auth.users cascades to profiles and
-- profile-owned rows such as friendships, food_lists, saved_places, and comments.

with demo_users as (
  select id
  from public.profiles
  where is_demo = true
)
delete from auth.users
where id in (select id from demo_users);

commit;
