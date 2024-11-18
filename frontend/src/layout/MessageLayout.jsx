import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'

const MessageLayout = () => {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <SideBar />
            <div className="w-full md:w-[calc(100%-100px)] h-screen flex flex-col ml-0 md:ml-[100px] overflow-hidden">
                <div className="w-full h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MessageLayout
