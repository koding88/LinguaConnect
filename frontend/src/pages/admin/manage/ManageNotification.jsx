import React, { useState, useEffect } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell } from "lucide-react"
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
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import useListenAdminNotification from '@/hooks/useListenAdminNotification';

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

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="flex flex-col items-center p-6 md:pt-10">
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Notification</h1>
                </div>

                <div className="w-full max-w-3xl space-y-6">
                    <div className="p-6 bg-white rounded-lg shadow-lg ring-1 ring-black/5">
                        <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
                        <ScrollArea className="h-[400px]">
                            {Object.entries(groupNotifications()).map(([group, notifications]) => (
                                notifications.length > 0 && (
                                    <div key={group} className="border-b last:border-b-0">
                                        <h3 className="sticky top-0 px-6 py-3 text-base font-bold text-gray-700 bg-gray-50 border-y border-gray-200 flex items-center gap-2 z-10">
                                            {group === 'new' ? (
                                                <>
                                                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"/>
                                                    New
                                                </>
                                            ) : 'Earlier'}
                                        </h3>
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification._id}
                                                className="flex items-start px-4 py-3 hover:bg-gray-50"
                                            >
                                                <Avatar className="h-10 w-10 mr-3">
                                                    <AvatarImage
                                                        src={notification.user.avatarUrl}
                                                        alt={notification.user.username}
                                                    />
                                                    <AvatarFallback>
                                                        {notification.user.username[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <a
                                                        href={notification.url}
                                                        className="block"
                                                    >
                                                        <p className="text-sm text-gray-900">
                                                            <span className="font-medium">
                                                                {notification.user.username}
                                                            </span>{' '}
                                                            {notification.content}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {extractTime(notification.createdAt)}
                                                        </p>
                                                    </a>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 ml-2"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ))}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageNotification
