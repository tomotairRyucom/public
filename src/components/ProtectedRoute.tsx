/**
 * 認証保護ルートコンポーネント
 * 
 * 未ログインユーザーをログインページにリダイレクトします。
 * 認証状態の確認中はローディング表示を行います。
 */

import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    // 認証状態の管理
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 現在のセッションを取得
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setLoading(false)
        }

        checkSession()

        // 認証状態の変更を監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        // クリーンアップ
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    // ローディング中の表示
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    // 未認証の場合はログインページにリダイレクト
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // 認証済みの場合は子コンポーネントを表示
    return <>{children}</>
}
