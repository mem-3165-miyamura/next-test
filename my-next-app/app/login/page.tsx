import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'; // emailRedirectTo のベースURL取得に使用

// Server Component
export default function LoginPage() {
  
  // ===================================
  // ✅ ログイン Server Action (SignIn)
  // ===================================
  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Cookieを扱えるサーバークライアントを取得
    const supabase = await createClient(); 

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('ログインエラー:', error.message);
      // エラー処理後、エラーメッセージ付きでリダイレクト
      return redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }

    // ログイン成功後、セッションCookieが設定され、ダッシュボードへリダイレクト
    return redirect('/dashboard'); 
  };


  // ===================================
  // ✅ サインアップ Server Action (SignUp)
  // ===================================
  const signUp = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();
    
    const origin = (await headers()).get('origin') || 'http://localhost:3000';

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // メール認証リンクの戻り先を指定（/auth/callback が処理）
        emailRedirectTo: `${origin}/auth/callback`, 
      },
    });

    if (error) {
      console.error('サインアップエラー:', error.message);
      return redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }

    // サインアップ成功、メール確認を促すメッセージページへリダイレクト
    return redirect('/message?type=confirm');
  };

  return (
    <div className="flex justify-center gap-10 p-10">
      {/* ログインフォーム */}
      <form action={signIn} className="border p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">ログイン</h2>
        <input name="email" type="email" placeholder="Email" required className="mb-3 p-2 border w-full"/>
        <input name="password" type="password" placeholder="Password" required className="mb-4 p-2 border w-full"/>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          ログイン
        </button>
      </form>

      {/* サインアップフォーム */}
      <form action={signUp} className="border p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">新規登録</h2>
        <input name="email" type="email" placeholder="Email" required className="mb-3 p-2 border w-full"/>
        <input name="password" type="password" placeholder="Password" required className="mb-4 p-2 border w-full"/>
        <button type="submit" className="bg-green-600 text-white p-2 rounded w-full">
          登録
        </button>
      </form>
    </div>
  );
}