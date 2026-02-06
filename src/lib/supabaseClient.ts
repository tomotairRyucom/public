/**
 * Supabaseクライアントの初期化
 * 
 * このファイルはSupabaseへの接続を管理します。
 * 環境変数からURL/キーを読み込み、シングルトンインスタンスを提供します。
 */

import { createClient } from '@supabase/supabase-js'

// 環境変数から接続情報を取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 環境変数が設定されていない場合のエラーハンドリング
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabaseの環境変数が設定されていません。.envファイルを確認してください。'
  )
}

// Supabaseクライアントを作成してエクスポート
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
