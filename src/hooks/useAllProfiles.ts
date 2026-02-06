/**
 * useAllProfiles フック
 * 
 * 管理者用：全ユーザーのプロフィール一覧を取得します。
 * ユーザーの更新・削除機能も提供します。
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types/profile'

interface UseAllProfilesReturn {
    profiles: Profile[]                                    // 全プロフィールリスト
    loading: boolean                                       // 読み込み中フラグ
    error: string | null                                   // エラーメッセージ
    refetch: () => Promise<void>                          // 再取得関数
    updateProfile: (id: string, updates: Partial<Pick<Profile, 'user_name' | 'is_admin'>>) => Promise<boolean>
    deleteProfile: (id: string) => Promise<boolean>
}

export function useAllProfiles(): UseAllProfilesReturn {
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 全プロフィールを取得する関数
    const fetchProfiles = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: true })

            if (fetchError) {
                throw fetchError
            }

            setProfiles(data as Profile[])
        } catch (err) {
            console.error('プロフィール一覧取得エラー:', err)
            setError(err instanceof Error ? err.message : 'プロフィール一覧の取得に失敗しました')
            setProfiles([])
        } finally {
            setLoading(false)
        }
    }, [])

    // プロフィールを更新する関数
    const updateProfile = useCallback(async (
        id: string,
        updates: Partial<Pick<Profile, 'user_name' | 'is_admin'>>
    ): Promise<boolean> => {
        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', id)

            if (updateError) {
                throw updateError
            }

            // ローカル状態を更新
            setProfiles(prev =>
                prev.map(p => p.id === id ? { ...p, ...updates } : p)
            )
            return true
        } catch (err) {
            console.error('プロフィール更新エラー:', err)
            setError(err instanceof Error ? err.message : 'プロフィールの更新に失敗しました')
            return false
        }
    }, [])

    // プロフィールを削除する関数（auth.usersからも削除が必要）
    const deleteProfile = useCallback(async (id: string): Promise<boolean> => {
        try {
            // profilesテーブルから削除（CASCADE設定により自動削除される場合もある）
            const { error: deleteError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id)

            if (deleteError) {
                throw deleteError
            }

            // ローカル状態を更新
            setProfiles(prev => prev.filter(p => p.id !== id))
            return true
        } catch (err) {
            console.error('プロフィール削除エラー:', err)
            setError(err instanceof Error ? err.message : 'プロフィールの削除に失敗しました')
            return false
        }
    }, [])

    // 初回マウント時にプロフィール一覧を取得
    useEffect(() => {
        fetchProfiles()
    }, [fetchProfiles])

    return {
        profiles,
        loading,
        error,
        refetch: fetchProfiles,
        updateProfile,
        deleteProfile,
    }
}
