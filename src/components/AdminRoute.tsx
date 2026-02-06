/**
 * 管理者専用ルートコンポーネント
 * 
 * is_adminがtrueのユーザーのみアクセス可能です。
 * 非管理者はメインメニューにリダイレクトされます。
 */

import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useIsAdmin } from '../hooks'
import { Loader2 } from 'lucide-react'

interface AdminRouteProps {
    children: ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
    const { isAdmin, loading } = useIsAdmin()

    // ローディング中の表示
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    // 非管理者はメインメニューにリダイレクト
    if (!isAdmin) {
        return <Navigate to="/" replace />
    }

    // 管理者は子コンポーネントを表示
    return <>{children}</>
}
