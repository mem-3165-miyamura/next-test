-- テーブル作成: profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique not null,
  email text not null,

  -- その他のカラム（例）
  full_name text,
  website text,

  -- タイムスタンプ
  created_at timestamp with time zone default now() not null
);

-- RLS (行レベルセキュリティ) 有効化
alter table profiles enable row level security;

-- ポリシー定義
create policy "Users can view their own profile."
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

-- 新規ユーザー登録時に profiles テーブルに自動挿入するための関数
CREATE OR REPLACE FUNCTION public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (new.id, new.raw_user_meta_data->>'user_name', new.email);
  return new;
end;
$$;

-- auth.users に行が挿入されたときに上記の関数を実行するトリガー
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();