/**
 * ログインページ
 * 
 * Email/Passwordによる認証を提供します。
 * ログイン成功時はメインメニューにリダイレクトします。
 */

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { LogIn, Mail, Lock, AlertCircle, Loader2, UserPlus } from 'lucide-react'

export function Login() {
    const navigate = useNavigate()

    // フォームの状態管理
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)

    // ログイン/サインアップ処理
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (isSignUp) {
                // 新規登録
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                // 登録成功時のメッセージ
                setError('確認メールを送信しました。メールを確認してください。')
            } else {
                // ログイン
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                // ログイン成功時はメインメニューに遷移
                navigate('/')
            }
        } catch (err) {
            // エラーメッセージの表示
            setError(err instanceof Error ? err.message : '認証に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            {/* 背景の装飾 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl" />
            </div>

            {/* ログインカード */}
            <div className="relative w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
                    {/* ヘッダー */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                            {isSignUp ? (
                                <UserPlus className="w-8 h-8 text-white" />
                            ) : (
                                <LogIn className="w-8 h-8 text-white" />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            {isSignUp ? 'アカウント作成' : 'ログイン'}
                        </h1>
                        <p className="text-slate-400 mt-2">
                            {isSignUp
                                ? '新しいアカウントを作成してください'
                                : 'アカウントにログインしてください'}
                        </p>
                    </div>

                    {/* フォーム */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* メールアドレス入力 */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                メールアドレス
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>

                        {/* パスワード入力 */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                パスワード
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* エラーメッセージ */}
                        {error && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${error.includes('確認メール')
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* 送信ボタン */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isSignUp ? (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    アカウント作成
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    ログイン
                                </>
                            )}
                        </button>
                    </form>

                    {/* 切り替えリンク */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError(null)
                            }}
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            {isSignUp
                                ? 'すでにアカウントをお持ちですか？ ログイン'
                                : 'アカウントをお持ちでないですか？ 新規登録'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
