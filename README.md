# Brokerage System Demo

A modern brokerage system built with Next.js and Supabase, featuring user authentication, account management, and transaction processing.

## Features

- User authentication (signup, login, logout)
- Account management
- Transaction processing (deposits, withdrawals, transfers)
- Real-time balance updates
- Transaction history

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Supabase (PostgreSQL, Authentication)
- Deployment: Vercel

## Environment Variables

The following environment variables are required:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Deploy to Vercel

1. Fork this repository
2. Create a new project on Vercel
3. Connect your forked repository
4. Add the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## Database Setup

1. Create a new project in Supabase
2. Run the following SQL in the SQL Editor:
   ```sql
   -- Enable RLS
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
   create policy "Users can view their own accounts"
     on public.accounts for select
     using (auth.uid() = user_id);

   create policy "Users can update their own accounts"
     on public.accounts for update
     using (auth.uid() = user_id);

   create policy "Users can view their own transactions"
     on public.transactions for select
     using (auth.uid() = user_id);

   create policy "Users can create transactions"
     on public.transactions for insert
     with check (auth.uid() = user_id);
   ```

## Testing

Run the test script to verify functionality:
```bash
npx tsx test-backend.ts
``` 