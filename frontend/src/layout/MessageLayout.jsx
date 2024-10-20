import React from 'react'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'

const MessageLayout = () => {
    return (
        <>
            <SideBar />
            <div className="mx-auto w-full md:w-[calc(100%-112px)] h-screen flex flex-col px-4 md:px-0 ml-0 md:ml-28 overflow-hidden">
                <Outlet />
            </div>
        </>
    )
}

export default MessageLayout
