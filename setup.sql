-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create accounts table
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  balance decimal(12,2) default 0 not null,
  currency text default 'USD' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on accounts
alter table public.accounts enable row level security;

-- Create transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER')) not null,
  amount decimal(12,2) not null,
  status text check (status in ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')) default 'PENDING' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on transactions
alter table public.transactions enable row level security;

-- Create RLS policies

-- Accounts policies
create policy "Users can view their own accounts"
  on public.accounts for select
  using (auth.uid() = user_id);

create policy "Users can update their own accounts"
  on public.accounts for update
  using (auth.uid() = user_id);

-- Transactions policies
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can create transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id); 