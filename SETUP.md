# Setup Guide — Login Feature

## 1. Create a free Supabase project
1. Go to https://supabase.com and sign up (free)
2. Click "New project", give it a name, set a password, click Create
3. Wait ~1 minute for it to initialize

## 2. Create the database table
In your Supabase project, go to **SQL Editor** and run this:

```sql
create table academic_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  data jsonb,
  updated_at timestamptz default now()
);

alter table academic_records enable row level security;

create policy "Users can only access their own record"
on academic_records for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 3. Get your API keys
In Supabase: **Settings → API**
- Copy "Project URL"
- Copy "anon public" key

## 4. Add keys to Vercel
In Vercel dashboard → your project → **Settings → Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key

Click Save, then Redeploy.

## 5. (Optional) Enable email confirmation bypass for testing
Supabase → Authentication → Settings → disable "Enable email confirmations"
