--
-- Supabase ローカル環境用のシードデータ
--

-- 外部キー制約を一時的に無効化する
SET session_replication_role = 'replica';

-- TRUNCATE TABLE public.profiles RESTART IDENTITY CASCADE;  -- 実行前にリセットされるためコメントアウト

INSERT INTO public.profiles (id, username, email, full_name)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'test_user_a', 'test.a@example.com', '太郎 山田'),
    ('00000000-0000-0000-0000-000000000002', 'test_user_b', 'test.b@example.com', '花子 佐藤');

-- 外部キー制約を元に戻す（有効化）
SET session_replication_role = 'origin';