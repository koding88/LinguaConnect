import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from '@/context/AuthContext'
import AuthGuard from '@/guard/AuthGuard'
import AdminGuard from '@/guard/AdminGuard'
import Spinner from '@/components/Spinner'
import SpinnerTop from '@/components/SpinnerTop'
import Notification from '@/pages/notification/Notification'
import ManageNotification from '@/pages/admin/manage/ManageNotification'

// Layouts
const Main = lazy(() => import('@/layout/Main'))
const MessageLayout = lazy(() => import('@/layout/MessageLayout'))
const AdminLayout = lazy(() => import('@/layout/admin/AdminLayout'))

// Auth Pages
const Login = lazy(() => import('@/pages/login/Login'))
const Register = lazy(() => import('@/pages/register/Register'))
const Login2FA = lazy(() => import('@/pages/login/Login2FA'))
const OAuthCallback = lazy(() => import('@/pages/login/OAuthCallback'))
const ForgotPassword = lazy(() => import('@/pages/password/ForgotPassword'))
const RecoverPassword = lazy(() => import('@/pages/password/RecoverPassword'))

// Main Pages
const Home = lazy(() => import('@/pages/home/Home'))
const PostDetail = lazy(() => import('@/pages/home/PostDetail'))
const Profile = lazy(() => import('@/pages/profile/Profile'))
const SearchPage = lazy(() => import('@/pages/search/Search'))
const Setting = lazy(() => import('@/pages/settings/Setting'))
const Messages = lazy(() => import('@/pages/messages/Messages'))
const NotFound = lazy(() => import('@/pages/404'))

// Group Pages
const Group = lazy(() => import('@/pages/group/Group'))
const GroupDetail = lazy(() => import('@/pages/group/GroupDetail'))
const GroupPostDetail = lazy(() => import('@/pages/group/post/GroupPostDetail'))

// Admin Pages
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const ManageAccount = lazy(() => import('@/pages/admin/manage/accounts/ManageAccount'))
const AccountDetail = lazy(() => import('@/pages/admin/manage/accounts/AccountDetail'))
const ManageGroup = lazy(() => import('@/pages/admin/manage/groups/ManageGroup'))
const GroupDetailManage = lazy(() => import('@/pages/admin/manage/groups/GroupDetailManage'))
const ManagePost = lazy(() => import('@/pages/admin/manage/posts/ManagePost'))
const PostDetailManage = lazy(() => import('@/pages/admin/manage/posts/PostDetailManage'))
const ManageTopic = lazy(() => import('@/pages/admin/manage/topics/ManageTopic'))
const CreateTopic = lazy(() => import('@/pages/admin/manage/topics/CreateTopic'))
const DetailTopic = lazy(() => import('@/pages/admin/manage/topics/DetailTopic'))
const UpdateTopic = lazy(() => import('@/pages/admin/manage/topics/UpdateTopic'))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'))

const publicRoutes = [
    { path: '/login', element: <Suspense fallback={<Spinner />}><Login /></Suspense> },
    { path: '/register', element: <Suspense fallback={<Spinner />}><Register /></Suspense> },
    { path: '/login/2fa', element: <Suspense fallback={<Spinner />}><Login2FA /></Suspense> },
    { path: '/login/oauth', element: <Suspense fallback={<Spinner />}><OAuthCallback /></Suspense> },
    { path: '/forgot-password', element: <Suspense fallback={<Spinner />}><ForgotPassword /></Suspense> },
    { path: '/forgot-password/recover', element: <Suspense fallback={<Spinner />}><RecoverPassword /></Suspense> },
]

const mainRoutes = {
    element: (
        <AuthGuard>
            <Suspense fallback={<Spinner />}>
                <Main />
            </Suspense>
        </AuthGuard>
    ),
    children: [
        { path: "/", element: <Suspense fallback={<Spinner />}><Home /></Suspense> },
        { path: "/post/:postId", element: <Suspense fallback={<Spinner />}><PostDetail /></Suspense> },
        { path: "/profile/:userId", element: <Suspense fallback={<Spinner />}><Profile /></Suspense> },
        { path: "/search", element: <Suspense fallback={<Spinner />}><SearchPage /></Suspense> },
        { path: "/settings", element: <Suspense fallback={<Spinner />}><Setting /></Suspense> },
        { path: "/groups", element: <Suspense fallback={<Spinner />}><Group /></Suspense> },
        { path: "/groups/:groupId", element: <Suspense fallback={<Spinner />}><GroupDetail /></Suspense> },
        { path: "/groups/:groupId/posts/:postId", element: <Suspense fallback={<Spinner />}><GroupPostDetail /></Suspense> },
        { path: "/notifications", element: <Suspense fallback={<Spinner />}><Notification /></Suspense> },
    ]
}

const messageRoutes = {
    element: (
        <AuthGuard>
            <Suspense fallback={<SpinnerTop />}>
                <MessageLayout />
            </Suspense>
        </AuthGuard>
    ),
    children: [{ path: "/messages", element: <Suspense fallback={<SpinnerTop />}><Messages /></Suspense> }]
}

const adminRoutes = {
    path: "/admin/*",
    element: (
        <AuthGuard>
            <AdminGuard>
                <Suspense fallback={<Spinner />}>
                    <AdminLayout />
                </Suspense>
            </AdminGuard>
        </AuthGuard>
    ),
    children: [
        { path: "dashboard", element: <Suspense fallback={<SpinnerTop />}><Dashboard /></Suspense> },
        { path: "manage/accounts", element: <Suspense fallback={<SpinnerTop />}><ManageAccount /></Suspense> },
        { path: "manage/accounts/:userId", element: <Suspense fallback={<SpinnerTop />}><AccountDetail /></Suspense> },
        { path: "manage/groups", element: <Suspense fallback={<SpinnerTop />}><ManageGroup /></Suspense> },
        { path: "manage/groups/:groupId", element: <Suspense fallback={<SpinnerTop />}><GroupDetailManage /></Suspense> },
        { path: "manage/posts", element: <Suspense fallback={<SpinnerTop />}><ManagePost /></Suspense> },
        { path: "manage/posts/:postId", element: <Suspense fallback={<SpinnerTop />}><PostDetailManage /></Suspense> },
        { path: "manage/topics", element: <Suspense fallback={<SpinnerTop />}><ManageTopic /></Suspense> },
        { path: "manage/topics/create", element: <Suspense fallback={<SpinnerTop />}><CreateTopic /></Suspense> },
        { path: "manage/topics/:topicId/edit", element: <Suspense fallback={<SpinnerTop />}><UpdateTopic /></Suspense> },
        { path: "manage/topics/:topicId", element: <Suspense fallback={<SpinnerTop />}><DetailTopic /></Suspense> },
        { path: "manage/notifications", element: <Suspense fallback={<SpinnerTop />}><ManageNotification /></Suspense> },
        { path: "settings", element: <Suspense fallback={<SpinnerTop />}><AdminSettings /></Suspense> },
    ]
}

const router = createBrowserRouter([
    ...publicRoutes,
    mainRoutes,
    messageRoutes,
    adminRoutes,
    { path: "*", element: <Suspense fallback={<Spinner />}><NotFound /></Suspense> }
])

export default function Router() {
    return (
        <AuthContextProvider>
            <RouterProvider router={router} />
        </AuthContextProvider>
    )
}
