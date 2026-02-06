/**
 * メインメニューページ
 * 
 * ログイン後に表示されるダッシュボード画面です。
 * ユーザー情報、プロフィール、管理者状態を表示します。
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useProfile, useIsAdmin } from '../hooks'
import {
    LogOut,
    Home,
    Settings,
    User as UserIcon,
    Bell,
    Menu,
    X,
    Shield,
    Loader2
} from 'lucide-react'

export function MainMenu() {
    const navigate = useNavigate()
    const { profile, loading: profileLoading, error: profileError } = useProfile()
    const { isAdmin, loading: adminLoading, error: adminError } = useIsAdmin()
    const [logoutLoading, setLogoutLoading] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    // ログアウト処理
    const handleLogout = async () => {
        setLogoutLoading(true)
        await supabase.auth.signOut()
        setLogoutLoading(false)
        navigate('/login')
    }

    // メニュー項目
    const menuItems = [
        { icon: Home, label: 'ホーム', active: true },
        { icon: UserIcon, label: 'プロフィール', active: false },
        { icon: Bell, label: '通知', active: false },
        { icon: Settings, label: '設定', active: false },
    ]

    // 読み込み中の表示
    const isLoading = profileLoading || adminLoading

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* ヘッダー */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* ロゴ */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Home className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <span className="ml-3 text-xl font-bold text-white">MyApp</span>
                            {/* 管理者バッジ */}
                            {isAdmin && (
                                <span className="ml-3 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    管理者
                                </span>
                            )}
                        </div>

                        {/* デスクトップナビ */}
                        <nav className="hidden md:flex items-center space-x-4">
                            {menuItems.map((item) => (
                                <button
                                    key={item.label}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${item.active
                                        ? 'bg-white/10 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* ユーザーメニュー */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm truncate max-w-[150px]">
                                    {profile?.user_name || profile?.email}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">ログアウト</span>
                            </button>

                            {/* モバイルメニューボタン */}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="md:hidden p-2 text-slate-400 hover:text-white"
                            >
                                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* モバイルメニュー */}
                {menuOpen && (
                    <div className="md:hidden border-t border-white/10">
                        <div className="px-4 py-3 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.label}
                                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${item.active
                                        ? 'bg-white/10 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ウェルカムカード */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-white">
                            ようこそ！ 🎉
                        </h1>
                        {isAdmin && (
                            <span className="px-3 py-1 bg-amber-500/30 text-amber-300 text-sm font-medium rounded-full flex items-center gap-1">
                                <Shield className="w-4 h-4" />
                                管理者権限
                            </span>
                        )}
                    </div>
                    <p className="text-slate-300">
                        {isAdmin
                            ? 'あなたは管理者として登録されています。すべての機能にアクセスできます。'
                            : 'ログインに成功しました。これはメインメニュー画面のテンプレートです。'}
                    </p>
                </div>

                {/* ダッシュボードグリッド */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* カード1 */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Home className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">ダッシュボード</h3>
                        <p className="text-slate-400 text-sm">
                            アプリケーションの概要を確認できます。
                        </p>
                    </div>

                    {/* カード2 */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <UserIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">プロフィール</h3>
                        <p className="text-slate-400 text-sm">
                            あなたのプロフィール情報を編集できます。
                        </p>
                    </div>

                    {/* カード3 - 管理者のみ表示 */}
                    {isAdmin && (
                        <div
                            onClick={() => navigate('/admin/users')}
                            className="bg-white/5 backdrop-blur-xl rounded-xl border border-amber-500/30 p-6 hover:bg-white/10 transition-all cursor-pointer group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6 text-amber-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">ユーザー管理</h3>
                            <p className="text-slate-400 text-sm">
                                登録ユーザーの管理・編集・削除を行えます。
                            </p>
                        </div>
                    )}

                    {/* カード4 */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Settings className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">設定</h3>
                        <p className="text-slate-400 text-sm">
                            アプリケーションの設定をカスタマイズできます。
                        </p>
                    </div>
                </div>

                {/* プロフィール情報カード */}
                <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">プロフィール情報</h2>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                        </div>
                    ) : (profileError || adminError) ? (
                        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <p className="text-red-300 text-sm">
                                プロフィールの取得に失敗しました: {profileError || adminError}
                            </p>
                        </div>
                    ) : !profile ? (
                        <div className="p-4 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                            <p className="text-amber-300 text-sm">
                                プロフィールが見つかりません。ページを再読み込みしてください。
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 w-28">メール:</span>
                                <span className="text-white">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 w-28">ユーザー名:</span>
                                <span className="text-white">
                                    {profile.user_name || <span className="text-slate-500 italic">未設定</span>}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 w-28">権限:</span>
                                <span className={`flex items-center gap-1 ${isAdmin ? 'text-amber-400' : 'text-slate-300'}`}>
                                    {isAdmin ? (
                                        <>
                                            <Shield className="w-4 h-4" />
                                            管理者
                                        </>
                                    ) : (
                                        '一般ユーザー'
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 w-28">ユーザーID:</span>
                                <span className="text-white font-mono text-sm">{profile.id}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 w-28">登録日:</span>
                                <span className="text-white">
                                    {profile.created_at && new Date(profile.created_at).toLocaleString('ja-JP')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
