import { supabase } from './supabase';
import { Profile } from '../types/types'; // types/types.ts のパスに合わせて修正

export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*') // 全カラムを取得
    .returns<Profile[]>(); // 取得結果の型を Profile の配列として指定

  if (error) {
    console.error('Error fetching profiles:', error.message);
    // 画面に表示するデータがない場合、空の配列またはエラーを返す
    return []; 
  }

  return data;
}