import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'

const Main = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <SideBar />
            <div className="md:pl-[100px] min-h-screen">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 pb-20 md:pb-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Main
