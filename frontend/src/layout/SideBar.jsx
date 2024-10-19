import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'
import logo from '@/assets/logo.png'
import { FaHome, FaRegHeart } from "react-icons/fa";
import { CiSearch, CiSettings } from "react-icons/ci";
import { MdGroups2 } from "react-icons/md";
import { RiMessengerLine } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import useUserZ from '@/zustand/useUserZ';
import { useAuthContext } from '@/context/AuthContext'

const SideBar = () => {
    const { authUser } = useAuthContext()
    const [isOpen, setIsOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuTimeoutRef = useRef(null);

    const navItems = [
        { icon: <FaHome className="w-8 h-8" />, path: '/' },
        { icon: <CiSearch className="w-8 h-8" />, path: '/search' },
        { icon: <MdGroups2 className="w-8 h-8" />, path: '/groups' },
        { icon: <RiMessengerLine className="w-8 h-8" />, path: '/messages' },
        { icon: <FaRegHeart className="w-8 h-8" />, path: '/notifications' },
        { icon: <IoAddCircleOutline className="w-8 h-8" />, path: '/create' },
    ];

    const handlers = useSwipeable({
        onSwipedLeft: () => setIsOpen(false),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.sidebar')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleShowMenu = () => {
        setShowMenu(true);
        clearTimeout(menuTimeoutRef.current);
        menuTimeoutRef.current = setTimeout(() => {
            setShowMenu(false);
        }, 5000);
    };

    const handleHideMenu = () => {
        clearTimeout(menuTimeoutRef.current);
        setShowMenu(false);
    };

    return (
        <div {...handlers}>
            <div className="md:hidden p-4">
                <button onClick={() => setIsOpen(!isOpen)}>
                    <GiHamburgerMenu className="w-6 h-6" />
                </button>
            </div>
            <div className={`sidebar fixed left-0 top-0 h-full w-[100px] flex flex-col bg-white transition-transform transform z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-center p-4">
                    <img src={logo} alt="Logo" className="w-20 h-20 object-cover" />
                </div>
                <nav className="flex-1 flex flex-col justify-start space-y-4 mt-8">
                    {navItems.map((item, index) => (
                        <SideBarIcon key={index} icon={item.icon} path={item.path} />
                    ))}
                </nav>
                <div className="mb-4">
                    <SideBarIcon
                        icon={<img src={authUser?.avatarUrl} alt={authUser?.username} className="w-8 h-8 rounded-lg border-2 border-gray-300" />}
                        path={`/profile/${authUser?._id}`}
                    />
                </div>
                <div className="p-4 relative">
                    <button
                        onClick={handleShowMenu}
                        className="sidebar-icon flex justify-center items-center h-12 w-12 transition-colors duration-300 hover:bg-gray-200 mx-auto rounded-lg"
                    >
                        <GiHamburgerMenu className="w-6 h-6" />
                    </button>
                    {showMenu && (
                        <div
                            className="absolute top-0 left-16 ml-2 bg-white border border-gray-200 rounded-lg w-48"
                            onMouseEnter={() => clearTimeout(menuTimeoutRef.current)}
                            onMouseLeave={handleHideMenu}
                        >
                            <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100 w-full rounded-t-lg">
                                <CiSettings className="mr-2 w-5 h-5" /> Settings
                            </Link>
                            <button onClick={logout} className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left rounded-b-lg">
                                <IoIosLogOut className="mr-2 w-5 h-5" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const SideBarIcon = ({ icon, path }) => (
    <Link to={path} className="sidebar-icon flex justify-center items-center h-12 w-12 transition-colors duration-300 hover:bg-gray-200 mx-auto rounded-lg">
        {icon}
    </Link>
)

export default SideBar
