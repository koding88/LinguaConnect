import React from 'react'
import SideBar from './SideBar'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext';

const Main = () => {

    return (
        <>
            <SideBar />
            <div className="container mx-auto w-full md:w-[640px] h-screen flex flex-col px-4 md:px-0">
                <Outlet />
            </div>
        </>
    );
}

export default Main
