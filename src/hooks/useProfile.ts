/**
 * useProfile フック
 * 
 * 現在ログイン中のユーザーのプロフィール情報を取得・管理します。
 * プロフィールの取得、更新機能を提供します。
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types/profile'

interface UseProfileReturn {
    profile: Profile | null       // プロフィールデータ
    loading: boolean              // 読み込み中フラグ
    error: string | null          // エラーメッセージ
    refetch: () => Promise<void>  // 再取得関数
    updateUserName: (userName: string) => Promise<boolean>  // ユーザー名更新
}

export function useProfile(): UseProfileReturn {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // プロフィールを取得する関数
    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            // 現在のユーザーを取得
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setProfile(null)
                return
            }

            // プロフィールを取得
            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (fetchError) {
                console.error('Supabase fetch error:', fetchError)
                throw new Error(`Supabase Error: ${fetchError.message} (Code: ${fetchError.code})`)
            }

            setProfile(data as Profile)
        } catch (err) {
            console.error('プロフィール取得エラー:', err)
            const errorMessage = err instanceof Error
                ? err.message
                : typeof err === 'object'
                    ? JSON.stringify(err)
                    : 'プロフィールの取得に失敗しました'
            setError(errorMessage)
            setProfile(null)
        } finally {
            setLoading(false)
        }
    }, [])

    // ユーザー名を更新する関数
    const updateUserName = useCallback(async (userName: string): Promise<boolean> => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                throw new Error('ログインしていません')
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ user_name: userName })
                .eq('id', user.id)

            if (updateError) {
                throw updateError
            }

            // ローカル状態を更新
            setProfile(prev => prev ? { ...prev, user_name: userName } : null)
            return true
        } catch (err) {
            console.error('ユーザー名更新エラー:', err)
            setError(err instanceof Error ? err.message : 'ユーザー名の更新に失敗しました')
            return false
        }
    }, [])

    // 初回マウント時にプロフィールを取得
    useEffect(() => {
        fetchProfile()

        // 認証状態の変更を監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    fetchProfile()
                } else {
                    setProfile(null)
                    setLoading(false)
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [fetchProfile])

    return {
        profile,
        loading,
        error,
        refetch: fetchProfile,
        updateUserName,
    }
}
