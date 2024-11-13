import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { CiSettings } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { FaUserTie } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { BsPostcard } from "react-icons/bs";
import { GiConversation } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";
import { FaGraduationCap, FaLanguage, FaRobot } from "react-icons/fa";

const AppSidebar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const menuTimeoutRef = useRef(null);
    const location = useLocation();

    const navItems = [
        { icon: <RxDashboard className="w-6 h-6" />, path: '/admin/dashboard', label: 'Dashboard' },
        { icon: <FaUserTie className="w-6 h-6" />, path: '/admin/manage/accounts', label: 'Accounts' },
        { icon: <FaUsers className="w-6 h-6" />, path: '/admin/manage/groups', label: 'Groups' },
        { icon: <BsPostcard className="w-6 h-6" />, path: '/admin/manage/posts', label: 'Posts' },
        { icon: <GiConversation className="w-6 h-6" />, path: '/admin/manage/topics', label: 'Topics' },
        { icon: <FaRegHeart className="w-6 h-6" />, path: '/admin/manage/notifications', label: 'Notifications' },
    ];

    const logout = () => {
        localStorage.clear();
        document.cookie = '';
        window.location.href = '/login';
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isMenuButton = event.target.closest('[data-menu-button]');
            const isMenuDropdown = event.target.closest('[data-menu-dropdown]');

            if (!isMenuButton && !isMenuDropdown) {
                setShowMenu(false);
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

    const mobileNavItems = navItems.slice(0, 4);

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block fixed left-0 top-0 h-full w-[100px] bg-gradient-to-b from-blue-50 to-white border-r border-gray-100 shadow-sm">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center p-4 relative group">
                        <div className="absolute inset-0 m-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 ease-linear"></div>
                        <div className="absolute inset-0 m-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 group-hover:rotate-180 transition-all duration-1000 ease-linear"></div>
                        <div className="relative w-16 h-16">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 h-16 object-cover rounded-xl transition-all duration-700 ease-linear group-hover:scale-110 z-10 relative"
                            />
                            <div className="absolute inset-0 -m-4 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-linear">
                                <div className="absolute inset-0 border-2 border-dashed border-blue-200/50 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-opacity-100 transition-all duration-700"></div>
                                <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-1 shadow-lg animate-pulse">
                                        <FaUsers className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full p-1 shadow-lg animate-pulse">
                                        <FaGraduationCap className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full p-1 shadow-lg animate-pulse">
                                        <FaLanguage className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-1 shadow-lg animate-pulse">
                                        <FaRobot className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 animate-[spin_10s_linear_infinite_reverse]">
                                    <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 bg-pink-400 rounded-full"></div>
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-linear z-20 whitespace-nowrap opacity-0 group-hover:opacity-100">
                            <div className="flex gap-1 text-xs font-bold">
                                <span className="animate-bounce bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" style={{animationDelay: "0ms"}}>Lingua</span>
                                <span className="animate-bounce bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" style={{animationDelay: "100ms"}}>Connect</span>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 flex flex-col justify-start gap-3 mt-8 px-4">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex justify-center items-center h-12 w-12 mx-auto rounded-xl transition-all duration-300
                                    ${location.pathname === item.path
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg'
                                        : 'text-gray-600 hover:bg-blue-50'}`}
                            >
                                {item.icon}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 space-y-3">
                        <button
                            data-menu-button
                            onClick={handleShowMenu}
                            className="flex justify-center items-center h-12 w-12 mx-auto rounded-xl transition-all duration-300 text-gray-600 hover:bg-blue-50"
                        >
                            <GiHamburgerMenu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
                <nav className="flex items-center h-16 px-2 max-w-md mx-auto">
                    <div className="flex-1 flex justify-around items-center">
                        {mobileNavItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`p-2 rounded-xl transition-all duration-300
                                    ${location.pathname === item.path
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-blue-50'}`}
                            >
                                {item.icon}
                            </Link>
                        ))}
                    </div>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-blue-100 to-purple-100 mx-2"></div>
                    <div className="px-2">
                        <button
                            data-menu-button
                            onClick={handleShowMenu}
                            className="p-2 rounded-xl transition-all duration-300 text-gray-600 hover:bg-blue-50"
                        >
                            <GiHamburgerMenu className="w-6 h-6" />
                        </button>
                    </div>
                </nav>
            </div>

            {/* Menu Dropdown */}
            {showMenu && (
                <div
                    data-menu-dropdown
                    className="fixed bottom-6 left-[90px] bg-white rounded-xl shadow-lg w-44 z-50 border border-gray-100 overflow-hidden hidden md:block"
                    onMouseEnter={() => clearTimeout(menuTimeoutRef.current)}
                    onMouseLeave={handleHideMenu}
                >
                    <Link
                        to="/admin/settings"
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200
                            ${location.pathname === '/admin/settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    >
                        <CiSettings className="w-5 h-5" />
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <div className="h-[1px] bg-gradient-to-r from-blue-100 to-purple-100" />
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 transition-colors duration-200"
                    >
                        <IoIosLogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            )}

            {/* Mobile Menu Dropdown */}
            {showMenu && (
                <div
                    data-menu-dropdown
                    className="fixed bottom-20 right-2 bg-white rounded-2xl shadow-lg w-56 z-50 border border-gray-100 overflow-hidden md:hidden"
                    onMouseEnter={() => clearTimeout(menuTimeoutRef.current)}
                    onMouseLeave={handleHideMenu}
                >
                    {navItems.slice(4).map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200 text-gray-600"
                        >
                            {item.icon}
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                    <div className="h-[1px] bg-gradient-to-r from-blue-100 to-purple-100" />
                    <Link
                        to="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200 text-gray-600"
                    >
                        <CiSettings className="w-5 h-5" />
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <div className="h-[1px] bg-gradient-to-r from-blue-100 to-purple-100" />
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 transition-colors duration-200"
                    >
                        <IoIosLogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default AppSidebar;
