-- supabase/seed.sql (修正案)
--
-- このシードデータは、RLSが有効な状態では使用できません。
-- RLSが一時的に無効になる supabase start/reset の直後でのみ動作します。
--

-- RLSが有効になっている場合、以下のシードは失敗する可能性があります。

-- 外部キー制約を一時的に無効化する
SET session_replication_role = 'replica';

-- 【重要】テストユーザーデータは、認証されたユーザーのデータに置き換えられるべきです。
-- RLSテストのためにprofilesデータを入れるには、auth.usersのIDが必要になるため、
-- このシードは空欄にして、手動でユーザーを作成することをおすすめします。
-- 初期データが必要な場合は、auth.usersにデータを挿入する必要がありますが、これは複雑です。

-- したがって、このシードはテスト目的以外では利用価値が低いです。

-- INSERT INTO public.profiles (id, username, email, full_name)
-- VALUES
--     ('00000000-0000-0000-0000-000000000001', 'test_user_a', 'test.a@example.com', '太郎 山田'),
--     ('00000000-0000-0000-0000-000000000002', 'test_user_b', 'test.b@example.com', '花子 佐藤');

-- 外部キー制約を元に戻す（有効化）
SET session_replication_role = 'origin';

-- 結論: RLSと外部キー制約の兼ね合いで、このシードはテスト目的以外では削除またはコメントアウトすべきです。