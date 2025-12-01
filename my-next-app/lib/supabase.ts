import { createClient } from '@supabase/supabase-js'

// 1. 環境変数を変数に格納
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 2. 存在しない場合はエラーを発生させてアプリケーションのクラッシュを防ぐ
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URLまたはAnon Keyが環境変数に設定されていません。'.env.local'を確認してください。");
}

// 3. チェックを通過したため、TypeScriptはこの時点ですべて string 型であることを認識する
//    （型を絞り込むことができ、エラーが解消される）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);