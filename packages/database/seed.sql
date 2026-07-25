insert into users (id, name, username, email, password_hash, role)
values (
  '11111111-1111-1111-1111-111111111111',
  'Aarav Sharma',
  'aarav',
  'aarav@finsmart.app',
  'pbkdf2:sha256:1000000$demo$replace_with_generated_hash',
  'member'
)
on conflict (email) do nothing;

insert into categories (user_id, name)
values
  ('11111111-1111-1111-1111-111111111111', 'Dining'),
  ('11111111-1111-1111-1111-111111111111', 'Transport'),
  ('11111111-1111-1111-1111-111111111111', 'Shopping'),
  ('11111111-1111-1111-1111-111111111111', 'Bills'),
  ('11111111-1111-1111-1111-111111111111', 'Investment')
on conflict (user_id, name) do nothing;

insert into goals (user_id, title, target_amount, current_amount, deadline, priority)
values
  ('11111111-1111-1111-1111-111111111111', 'Emergency fund', 300000, 226000, '2026-12-31', 'High'),
  ('11111111-1111-1111-1111-111111111111', 'MacBook upgrade', 180000, 78000, '2026-09-15', 'Medium')
on conflict do nothing;
