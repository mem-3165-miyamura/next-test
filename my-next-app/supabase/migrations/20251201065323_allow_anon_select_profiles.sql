-- 既存のポリシーはそのままにして、匿名での読み取りを許可するポリシーを追加します。
create policy "Allow public read access to profiles for testing"
  on profiles for select using (true);