import React, { useState, useEffect } from 'react'
import { Bell, BellRing, Trash2, Calendar, Clock, BellOff } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import useNotification from '@/zustand/useNotification'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { extractTime } from '@/utils/extractTime';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useListenAdminNotification from '@/hooks/useListenAdminNotification';

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="p-4 bg-gray-100/80 rounded-full mb-4">
            <BellOff className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No notifications yet</h3>
        <p className="text-gray-500 text-center max-w-sm">
            When you receive notifications about your system activities, they will appear here.
        </p>
    </div>
);

const ManageNotification = () => {
    useListenAdminNotification()
    const [notifications, setNotifications] = useState([])
    const { notifications: notificationStore } = useNotification()

    useEffect(() => {
        if (notificationStore) {
            setNotifications(notificationStore)
        }
    }, [notificationStore])

    const groupNotifications = () => {
        const now = new Date()
        const dayInMs = 24 * 60 * 60 * 1000

        return {
            new: notifications.filter(n => now - new Date(n.createdAt) < dayInMs),
            earlier: notifications.filter(n => now - new Date(n.createdAt) >= dayInMs)
        }
    }

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase() || '??';
    };

    const groupedNotifications = groupNotifications();
    const hasNotifications = notifications.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <div className="flex flex-col items-center p-4 sm:p-6 md:pt-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center gap-2 mb-8 text-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <BellRing className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Notifications
                    </h1>
                    <p className="text-gray-500 max-w-md text-sm md:text-base">
                        Stay updated with all activities and interactions
                    </p>
                </div>

                <div className="w-full max-w-3xl">
                    {/* Notifications List */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
                        {!hasNotifications ? (
                            <EmptyState />
                        ) : (
                            <ScrollArea className="h-[600px] w-full">
                                {Object.entries(groupedNotifications).map(([group, notifications]) => (
                                    notifications?.length > 0 && (
                                        <div key={group} className="border-b last:border-b-0">
                                            {/* Section Header */}
                                            <div className="sticky top-0 px-6 py-3 bg-white border-b border-gray-100 z-10">
                                                <div className="flex items-center gap-2 text-sm font-semibold">
                                                    {group === 'new' ? (
                                                        <>
                                                            <Clock className="w-4 h-4 text-blue-500" />
                                                            <span className="text-blue-600">New Notifications</span>
                                                            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                                                                {notifications.length}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Calendar className="w-4 h-4 text-gray-500" />
                                                            <span className="text-gray-600">Earlier</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Notifications */}
                                            <div className="divide-y divide-gray-50">
                                                {notifications?.map((notification) => (
                                                    <div
                                                        key={notification?._id}
                                                        className="flex items-start p-4 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Avatar className="h-10 w-10 mr-3 flex-shrink-0 ring-2 ring-white">
                                                            <AvatarImage
                                                                src={notification?.user?.avatarUrl}
                                                                alt={notification?.user?.username}
                                                            />
                                                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                                                                {getInitials(notification?.user?.username)}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="flex-1 min-w-0">
                                                            <a
                                                                href={notification?.url}
                                                                className="block hover:bg-gray-50 rounded-lg transition-colors"
                                                            >
                                                                <div className="text-sm text-gray-900">
                                                                    <span className="font-semibold">
                                                                        {notification?.user?.username}
                                                                    </span>{' '}
                                                                    <span className="text-gray-700">
                                                                        {notification?.content}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {extractTime(notification?.createdAt)}
                                                                </p>
                                                            </a>
                                                        </div>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0 ml-2 hover:bg-gray-100 rounded-full"
                                                                >
                                                                    <span className="sr-only">Open menu</span>
                                                                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                    </svg>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-36">
                                                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </ScrollArea>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageNotification
