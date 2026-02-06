/**
 * アプリケーションのメインエントリーポイント
 * 
 * React Routerを使用したルーティング設定を行います。
 * 保護ルートにより認証状態を管理します。
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { MainMenu } from './pages/MainMenu'
import { UserManagement } from './pages/UserManagement'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログインページ（誰でもアクセス可能） */}
        <Route path="/login" element={<Login />} />

        {/* メインメニュー（認証必須） */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          }
        />

        {/* ユーザー管理（認証必須 + 管理者のみ） */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* 未定義のパスはルートにリダイレクト */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
