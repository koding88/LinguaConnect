import React from 'react'
import Login from '@/pages/login/Login'
import Register from '@/pages/register/Register'
import Home from '@/pages/home/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from '@/context/AuthContext'
import AuthGuard from '@/guard/AuthGuard'
import Main from '@/layout/Main'
import MessageLayout from '@/layout/MessageLayout'
import PostDetail from '@/pages/home/PostDetail'
import Profile from '@/pages/profile/Profile'
import SearchPage from '@/pages/search/Search'
import Setting from '@/pages/settings/Setting'
import Login2FA from '@/pages/login/Login2FA'
import OAuthCallback from '@/pages/login/OAuthCallback'
import ForgotPassword from '@/pages/password/ForgotPassword'
import RecoverPassword from '@/pages/password/RecoverPassword'
import NotFound from '@/pages/404'
import Messages from '@/pages/messages/Messages'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login/2fa',
        element: <Login2FA />
    },
    {
        path: '/login/oauth',
        element: <OAuthCallback />
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />
    },
    {
        path: '/forgot-password/recover',
        element: <RecoverPassword />
    },
    {
        element: (
            <AuthGuard>
                <Main />
            </AuthGuard>
        ),
        children: [
            { path: "/", element: <Home /> },
            { path: "/post/:postId", element: <PostDetail /> },
            { path: "/profile/:userId", element: <Profile /> },
            { path: "/search", element: <SearchPage /> },
            { path: "/settings", element: <Setting /> },
        ]
    },
    {
        element: (
            <AuthGuard>
                <MessageLayout />
            </AuthGuard>
        ),
        children: [{ path: "/messages", element: <Messages /> }]
    },
    { path: "*", element: <NotFound /> },
])

export default function Router() {
    return (
        <AuthContextProvider>
            <RouterProvider router={router} />
        </AuthContextProvider>
    )
}
