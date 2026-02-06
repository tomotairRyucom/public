/**
 * useIsAdmin フック
 * 
 * 現在ログイン中のユーザーが管理者かどうかを判定します。
 * シンプルに is_admin 状態のみを提供する軽量フックです。
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

interface UseIsAdminReturn {
    isAdmin: boolean      // 管理者かどうか
    loading: boolean      // 読み込み中フラグ
    error: string | null  // エラーメッセージ
    refetch: () => Promise<void>  // 再取得関数
}

export function useIsAdmin(): UseIsAdminReturn {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 管理者状態を取得する関数
    const fetchIsAdmin = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            // 現在のユーザーを取得
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setIsAdmin(false)
                return
            }

            // is_adminのみを取得（軽量クエリ）
            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single()

            if (fetchError) {
                throw fetchError
            }

            setIsAdmin(data?.is_admin ?? false)
        } catch (err) {
            console.error('管理者状態取得エラー:', err)
            setError(err instanceof Error ? err.message : '管理者状態の取得に失敗しました')
            setIsAdmin(false)
        } finally {
            setLoading(false)
        }
    }, [])

    // 初回マウント時に管理者状態を取得
    useEffect(() => {
        fetchIsAdmin()

        // 認証状態の変更を監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    fetchIsAdmin()
                } else {
                    setIsAdmin(false)
                    setLoading(false)
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [fetchIsAdmin])

    return {
        isAdmin,
        loading,
        error,
        refetch: fetchIsAdmin,
    }
}
