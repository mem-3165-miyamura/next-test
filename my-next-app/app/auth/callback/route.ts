// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'; // 作成済みのサーバークライアント
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

// Supabase からのリダイレクト（メールリンクのクリック）は GET リクエストで処理されます
export async function GET(request: Request) {
  // 1. URLと認証コードの取得
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code'); // URLから 'code' パラメータを取得

  // 2. 認証コードの検証とセッション確立
  if (code) {
    const supabase = await createClient(); // サーバークライアントを取得

    // 認証コードをセッションに交換する（JWTを安全なCookieに設定する処理）
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('コールバック処理エラー:', error.message);
      // セッション確立失敗時はエラーページにリダイレクト
      return redirect(`${requestUrl.origin}/error?message=${encodeURIComponent("セッション確立エラー: " + error.message)}`);
    }
    
    // 3. セッション確立成功！ /dashboard へリダイレクト
    return redirect(`${requestUrl.origin}/dashboard`);
  }

  // code がない場合はエラーページへ
  return redirect(`${requestUrl.origin}/error?message=No authentication code provided`);
}