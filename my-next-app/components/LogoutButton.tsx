'use client'; // ボタン操作のためクライアントコンポーネント化

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

// ===================================
// ✅ ログアウト Server Action (SignOut)
// ===================================
const signOutAction = async () => {
  'use server';

  const supabase = await createClient(); // ★ await 必須
  
  // Supabaseにログアウトを指示し、安全なセッションCookieを削除
  await supabase.auth.signOut();
  
  // ログアウト後、ホームまたはログインページへリダイレクト
  return redirect('/');
};

export function LogoutButton() {
  const router = useRouter();
  
  // Client Component から Server Action を呼び出す
  return (
    <button 
      onClick={() => signOutAction()} // onClick で Server Action を呼び出し
      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
    >
      ログアウト
    </button>
  );
}

// フォームの action に直接 Server Action を渡すことも可能
/*
export function LogoutForm() {
    return (
        <form action={signOutAction}>
            <button type="submit">ログアウト</button>
        </form>
    )
}
*/