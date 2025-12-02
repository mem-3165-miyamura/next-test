// utils/supabase/server.ts
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Server Actionで使用するためのクライアントを作成するヘルパー関数
export const createClient = async () => {
  const cookieStore = await cookies(); 

  // 非推奨警告を回避するため、引数を順番に3つ渡す形式を維持し、
  // Cookieメソッドを getAll/setAll に統一します。
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!, 
    {
      cookies: {
        // ✅ 新しい推奨メソッド: getAll を実装
        getAll: () => cookieStore.getAll(),
        
        // ✅ 新しい推奨メソッド: setAll を実装
        setAll: (cookiesToSet) => {
          try {
            // cookiesToSet は設定すべき Cookie の配列です。これを反復処理して設定します。
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          } catch (e) {
            // Server Actionの標準エラー回避
          }
        },
        
        // 🚨 修正点: get, set, remove は非推奨であり、
        //    getAll/setAll と同時に存在すると型エラーになるため、削除します。
        
        // ログアウト時に setAll が呼ばれることで、Cookieの削除も処理されます。
      },
    }
  );
};