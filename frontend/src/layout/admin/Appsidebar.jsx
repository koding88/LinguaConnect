import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import logo from '@/assets/logo.png';
import { CiSettings } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import { useAuthContext } from '@/context/AuthContext';
import { RxDashboard } from "react-icons/rx";
import { FaUserTie } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { BsPostcard } from "react-icons/bs";
import { GiConversation } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";

const AppSidebar = () => {
    const { authUser } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuTimeoutRef = useRef(null);
    const location = useLocation();

    const navItems = [
        { icon: <RxDashboard className="w-8 h-8" />, path: '/admin/dashboard', label: 'Dashboard' },
        { icon: <FaUserTie className="w-8 h-8" />, path: '/admin/manage/accounts', label: 'Accounts' },
        { icon: <FaUsers className="w-8 h-8" />, path: '/admin/manage/groups', label: 'Groups' },
        { icon: <BsPostcard className="w-8 h-8" />, path: '/admin/manage/posts', label: 'Posts' },
        { icon: <GiConversation className="w-8 h-8" />, path: '/admin/manage/topics', label: 'Topics' },
        { icon: <FaRegHeart className="w-8 h-8" />, path: '/admin/manage/notifications', label: 'Notifications' },
    ];

    const handlers = useSwipeable({
        onSwipedLeft: () => setIsOpen(false),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const logout = () => {
        localStorage.clear();
        document.cookie = '';
        window.location.href = '/login';
    };

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
            <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-white z-50">
                <button onClick={() => setIsOpen(!isOpen)}>
                    <GiHamburgerMenu className="w-6 h-6" />
                </button>
            </div>
            <div className={`sidebar fixed left-0 top-0 h-screen w-[100px] flex flex-col bg-white border-r z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-center p-4">
                    <img src={logo} alt="Logo" className="w-20 h-20 object-cover" />
                </div>
                <nav className="flex-1 flex flex-col justify-start space-y-4 mt-8">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`sidebar-icon flex justify-center items-center h-12 w-12 transition-colors duration-300 hover:bg-gray-200 mx-auto rounded-lg ${location.pathname === item.path ? 'bg-gray-200' : ''}`}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </nav>
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
                            <Link
                                to="/admin/settings"
                                className={`flex items-center px-4 py-2 hover:bg-gray-100 w-full rounded-t-lg ${location.pathname === '/admin/settings' ? 'bg-gray-100' : ''}`}
                            >
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
    );
};

export default AppSidebar;
