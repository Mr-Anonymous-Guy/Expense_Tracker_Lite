create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name varchar(120) not null,
  username varchar(80),
  email varchar(255) not null unique,
  password_hash text not null,
  role varchar(30) not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  name varchar(80) not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  category_id uuid not null references categories(id) on delete restrict,
  merchant varchar(160) not null,
  amount numeric(12, 2) not null check (amount > 0),
  spent_at date not null,
  note varchar(300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists budgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  monthly_limit numeric(12, 2) not null check (monthly_limit > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category_id)
);

create table if not exists investments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  asset varchar(160) not null,
  kind varchar(40) not null check (kind in ('Mutual Fund', 'ETF', 'Stock', 'Crypto', 'Fixed Income')),
  units numeric(18, 6) not null default 0 check (units >= 0),
  current_value numeric(14, 2) not null default 0 check (current_value >= 0),
  monthly_sip numeric(12, 2) not null default 0 check (monthly_sip >= 0),
  goal varchar(180) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  title varchar(160) not null,
  target_amount numeric(14, 2) not null check (target_amount > 0),
  current_amount numeric(14, 2) not null default 0 check (current_amount >= 0),
  deadline date not null,
  priority varchar(20) not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists insights (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  title varchar(180) not null,
  body text not null,
  impact varchar(180) not null,
  priority varchar(20) not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  source varchar(40) not null default 'openai',
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  title varchar(180) not null,
  period varchar(80) not null,
  summary text not null,
  generated_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists idx_expenses_user_spent_at on expenses(user_id, spent_at desc);
create index if not exists idx_expenses_category on expenses(category_id);
create index if not exists idx_budgets_user on budgets(user_id);
create index if not exists idx_investments_user on investments(user_id);
create index if not exists idx_goals_user_deadline on goals(user_id, deadline asc);
create index if not exists idx_insights_user_created on insights(user_id, created_at desc);
create index if not exists idx_reports_user_generated on reports(user_id, generated_at desc);
