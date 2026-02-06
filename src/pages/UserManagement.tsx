/**
 * ユーザー管理ページ
 * 
 * 管理者専用：全ユーザーの一覧表示、編集、削除を行います。
 * 非管理者は閲覧のみ可能です。
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllProfiles, useProfile, useIsAdmin } from '../hooks'
import { supabase } from '../lib/supabaseClient'
import {
    ArrowLeft,
    Users,
    Edit2,
    Trash2,
    Check,
    X,
    Shield,
    ShieldOff,
    Loader2,
    AlertTriangle,
    LogOut
} from 'lucide-react'

// 編集中のユーザー情報
interface EditingUser {
    id: string
    user_name: string
    is_admin: boolean
}

export function UserManagement() {
    const navigate = useNavigate()
    const { profiles, loading, error, updateProfile, deleteProfile, refetch } = useAllProfiles()
    const { profile: currentUser } = useProfile()
    const { isAdmin } = useIsAdmin()

    // 編集状態
    const [editingUser, setEditingUser] = useState<EditingUser | null>(null)
    const [saving, setSaving] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    // ログアウト処理
    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    // 編集を開始
    const startEdit = (profile: EditingUser) => {
        setEditingUser({
            id: profile.id,
            user_name: profile.user_name,
            is_admin: profile.is_admin,
        })
        setDeleteConfirm(null)
    }

    // 編集をキャンセル
    const cancelEdit = () => {
        setEditingUser(null)
    }

    // 保存処理
    const handleSave = async () => {
        if (!editingUser) return

        setSaving(true)
        const success = await updateProfile(editingUser.id, {
            user_name: editingUser.user_name,
            is_admin: editingUser.is_admin,
        })
        setSaving(false)

        if (success) {
            setEditingUser(null)
        }
    }

    // 削除確認を表示
    const showDeleteConfirm = (id: string) => {
        setDeleteConfirm(id)
        setEditingUser(null)
    }

    // 削除処理
    const handleDelete = async (id: string) => {
        setSaving(true)
        const success = await deleteProfile(id)
        setSaving(false)

        if (success) {
            setDeleteConfirm(null)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* ヘッダー */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* 戻るボタン */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline">メニューに戻る</span>
                            </button>
                            <div className="h-6 w-px bg-white/20" />
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-amber-400" />
                                <span className="text-lg font-semibold text-white">ユーザー管理</span>
                            </div>
                        </div>

                        {/* ログアウトボタン */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">ログアウト</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 権限表示 */}
                {!isAdmin && (
                    <div className="mb-6 p-4 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <p className="text-amber-300">
                            閲覧モード: 管理者権限がないため、編集・削除はできません。
                        </p>
                    </div>
                )}

                {/* エラー表示 */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-300">{error}</p>
                        <button
                            onClick={refetch}
                            className="ml-auto text-sm text-red-300 hover:text-white underline"
                        >
                            再読み込み
                        </button>
                    </div>
                )}

                {/* ユーザーテーブル */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                    {/* テーブルヘッダー */}
                    <div className="px-6 py-4 border-b border-white/10">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-slate-400" />
                            登録ユーザー一覧
                            <span className="text-sm text-slate-400 font-normal">
                                （{profiles.length}人）
                            </span>
                        </h2>
                    </div>

                    {/* ローディング */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            ユーザー
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            ユーザー名
                                        </th>
                                        <th className="text-center px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            権限
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            登録日
                                        </th>
                                        {isAdmin && (
                                            <th className="text-right px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                操作
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {profiles.map((profile) => {
                                        const isCurrentUser = profile.id === currentUser?.id
                                        const isEditing = editingUser?.id === profile.id
                                        const isDeleting = deleteConfirm === profile.id

                                        return (
                                            <tr
                                                key={profile.id}
                                                className={`hover:bg-white/5 transition-colors ${isCurrentUser ? 'bg-blue-500/5' : ''
                                                    }`}
                                            >
                                                {/* メールアドレス */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                                            {profile.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-white text-sm">{profile.email}</p>
                                                            {isCurrentUser && (
                                                                <span className="text-xs text-blue-400">（あなた）</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ユーザー名（編集可能） */}
                                                <td className="px-6 py-4">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={editingUser.user_name}
                                                            onChange={(e) => setEditingUser({
                                                                ...editingUser,
                                                                user_name: e.target.value
                                                            })}
                                                            className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="ユーザー名"
                                                        />
                                                    ) : (
                                                        <span className="text-slate-300 text-sm">
                                                            {profile.user_name || <span className="text-slate-500 italic">未設定</span>}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* 権限（編集可能） */}
                                                <td className="px-6 py-4 text-center">
                                                    {isEditing ? (
                                                        <button
                                                            onClick={() => setEditingUser({
                                                                ...editingUser,
                                                                is_admin: !editingUser.is_admin
                                                            })}
                                                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${editingUser.is_admin
                                                                    ? 'bg-amber-500/30 text-amber-300 hover:bg-amber-500/40'
                                                                    : 'bg-slate-500/30 text-slate-300 hover:bg-slate-500/40'
                                                                }`}
                                                        >
                                                            {editingUser.is_admin ? (
                                                                <>
                                                                    <Shield className="w-4 h-4" />
                                                                    管理者
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShieldOff className="w-4 h-4" />
                                                                    一般
                                                                </>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${profile.is_admin
                                                                ? 'bg-amber-500/20 text-amber-300'
                                                                : 'bg-slate-500/20 text-slate-400'
                                                            }`}>
                                                            {profile.is_admin ? (
                                                                <>
                                                                    <Shield className="w-3 h-3" />
                                                                    管理者
                                                                </>
                                                            ) : (
                                                                '一般'
                                                            )}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* 登録日 */}
                                                <td className="px-6 py-4 text-slate-400 text-sm">
                                                    {new Date(profile.created_at).toLocaleDateString('ja-JP')}
                                                </td>

                                                {/* 操作ボタン（管理者のみ） */}
                                                {isAdmin && (
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {isEditing ? (
                                                                <>
                                                                    {/* 保存ボタン */}
                                                                    <button
                                                                        onClick={handleSave}
                                                                        disabled={saving}
                                                                        className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                                                        title="保存"
                                                                    >
                                                                        {saving ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <Check className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                    {/* キャンセルボタン */}
                                                                    <button
                                                                        onClick={cancelEdit}
                                                                        disabled={saving}
                                                                        className="p-2 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 transition-colors disabled:opacity-50"
                                                                        title="キャンセル"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </>
                                                            ) : isDeleting ? (
                                                                <>
                                                                    {/* 削除確認 */}
                                                                    <span className="text-red-400 text-sm mr-2">削除しますか？</span>
                                                                    <button
                                                                        onClick={() => handleDelete(profile.id)}
                                                                        disabled={saving}
                                                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                                                        title="削除を確定"
                                                                    >
                                                                        {saving ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <Check className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setDeleteConfirm(null)}
                                                                        disabled={saving}
                                                                        className="p-2 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 transition-colors disabled:opacity-50"
                                                                        title="キャンセル"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {/* 編集ボタン */}
                                                                    <button
                                                                        onClick={() => startEdit({
                                                                            id: profile.id,
                                                                            user_name: profile.user_name,
                                                                            is_admin: profile.is_admin
                                                                        })}
                                                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                                                        title="編集"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                    {/* 削除ボタン（自分自身は無効化） */}
                                                                    <button
                                                                        onClick={() => showDeleteConfirm(profile.id)}
                                                                        disabled={isCurrentUser}
                                                                        className={`p-2 rounded-lg transition-colors ${isCurrentUser
                                                                                ? 'bg-slate-500/10 text-slate-600 cursor-not-allowed'
                                                                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                                            }`}
                                                                        title={isCurrentUser ? '自分自身は削除できません' : '削除'}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {/* 空状態 */}
                            {profiles.length === 0 && !loading && (
                                <div className="text-center py-16 text-slate-400">
                                    ユーザーが登録されていません。
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 注意書き */}
                {isAdmin && (
                    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-white/10">
                        <h3 className="text-sm font-medium text-slate-300 mb-2">注意事項</h3>
                        <ul className="text-xs text-slate-400 space-y-1">
                            <li>• メールアドレスは変更できません。</li>
                            <li>• 自分自身を削除することはできません。</li>
                            <li>• 削除したユーザーはログインできなくなります。</li>
                        </ul>
                    </div>
                )}
            </main>
        </div>
    )
}
