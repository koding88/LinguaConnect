import React, { useEffect } from 'react'
import AppSidebar from "./Appsidebar"
import { Outlet } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminLayout() {
    const navigate = useNavigate()

    useEffect(() => {
        // Add class to body when admin layout is mounted
        document.body.classList.add('admin-layout')
        return () => {
            // Remove class when unmounted
            document.body.classList.remove('admin-layout')
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <AppSidebar />

            {/* Back to Home Button - Only visible on mobile */}
            <div className="fixed top-4 right-4 md:hidden z-50">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 hover:text-blue-600"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            {/* Main Content */}
            <main className="transition-all duration-300 ease-in-out
                lg:ml-[100px] md:ml-[100px] ml-0
                lg:p-8 md:p-6 p-4
                min-h-screen
                pb-24 md:pb-8" // Extra padding bottom for mobile navigation
            >
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Gradient Overlay for aesthetics */}
            <div className="fixed inset-0 bg-gradient-to-tr from-blue-50/50 via-purple-50/30 to-pink-50/50 -z-10 pointer-events-none" />
        </div>
    )
}
