import { createClient } from '@/utils/supabase/server'; // 安全なサーバークライアント
import { redirect } from 'next/navigation';

// Server Component (async function)
export default async function DashboardPage() {
  // 1. 認証クライアントの取得
  const supabase = await createClient();

  // 2. セッションの取得と認証チェック
  //    サーバーサイドで Cookie から JWT を読み取り、有効性を検証します。
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // エラーチェック（ネットワークエラーやトークン期限切れなど）
  if (sessionError) {
    console.error("セッション取得エラー:", sessionError);
    // 認証エラー時はログインページにリダイレクト
    redirect('/login');
  }

  // セッションがない（未ログイン）場合、ログインページに強制リダイレクト
  if (!session) {
    redirect('/login');
  }

  // 3. 認証済みユーザーのプロフィールデータ取得
  //    RLS が設定されているため、auth.uid() == session.user.id となります。
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('username, email, created_at')
    .eq('id', session.user.id) // ログインユーザーのIDでフィルタリング
    .single();

  if (profileError) {
    console.error("プロフィールデータの取得エラー:", profileError);
    // ⚠️ トリガー削除により profiles テーブルが空の可能性あり
    // ここではエラーを許容し、データがないことを表示します。
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">✅ ダッシュボード (認証成功)</h1>
      <p className="mb-4 text-sm text-gray-500">このページはログイン済みユーザーのみがアクセス可能です。</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">ユーザー情報</h2>
        
        {profileData ? (
          <>
            <p><strong>ユーザー名:</strong> {profileData.username}</p>
            <p><strong>メール:</strong> {profileData.email}</p>
            <p><strong>登録日:</strong> {new Date(profileData.created_at).toLocaleDateString()}</p>
          </>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded">
            <p className="text-yellow-800">⚠️ **プロフィールデータが見つかりません。**</p>
            <p className="text-sm mt-1">
              (サインアップ時の自動挿入トリガーを削除したためです。手動で挿入するか、トリガーを再作成してください。)
            </p>
          </div>
        )}
        
        <p className="mt-4 text-sm text-gray-600">ユーザーID: {session.user.id}</p>
      </div>
      
      {/* ログアウトボタンはClient Componentであるため、別途配置が必要 */}
      {/* <LogoutButton /> */}
    </div>
  );
}