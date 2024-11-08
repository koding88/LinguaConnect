import React from 'react'
import AppSidebar from "./Appsidebar"
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
    return (
        <div className="flex">
            <AppSidebar />
            <main className="flex-1 ml-[100px]">
                <Outlet />
            </main>
        </div>
    )
}
