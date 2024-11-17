import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { extractTime } from '@/utils/extractTime';
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Clock, CircleDot, Bell, BellOff } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from '@/components/header/Header';
import useNotification from '@/zustand/useNotification';
import Alert from '@/components/alert/Alert';
import useListenNotification from '@/hooks/useListenNotification';
import { ScrollArea } from "@/components/ui/scroll-area";

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 h-[calc(100vh-120px)]">
        <div className="p-4 bg-gray-100/80 rounded-full mb-4">
            <BellOff className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No notifications yet</h3>
        <p className="text-gray-500 text-center max-w-sm">
            When you receive notifications about your activities, they will appear here.
        </p>
    </div>
);

const Notification = () => {
    useListenNotification();
    const navigate = useNavigate();
    const {
        fetchNotifications,
        markAsRead,
        deleteNotification,
        groupNotifications
    } = useNotification();

    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [selectedNotificationId, setSelectedNotificationId] = React.useState(null);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleNotificationClick = async (notification) => {
        try {
            await markAsRead(notification._id);
            navigate(notification.url);
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    const handleDeleteClick = (notificationId, e) => {
        e.stopPropagation();
        setSelectedNotificationId(notificationId);
        setIsAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedNotificationId) {
            await deleteNotification(selectedNotificationId);
            setIsAlertOpen(false);
            setSelectedNotificationId(null);
        }
    };

    return (
        <>
            <Header props={{ path: -1, title: 'Notifications' }} />
            <div className='flex-grow flex flex-col'>
                <div className='space-y-4'>
                    <div className='bg-white rounded-2xl shadow-xl border border-gray-100'>
                        <ScrollArea className="h-full">
                            {Object.entries(groupNotifications()).every(([_, notifications]) => notifications.length === 0) ? (
                                <EmptyState />
                            ) : (
                                Object.entries(groupNotifications()).map(([group, notifications]) => (
                                    notifications.length > 0 && (
                                        <div key={group} className="border-b last:border-b-0">
                                            <h3 className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-blue-50 to-purple-50 border-y border-gray-100 flex items-center gap-2">
                                                {group === 'new' ? (
                                                    <>
                                                        <CircleDot className="w-4 h-4 text-blue-600"/>
                                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                                            New Notifications
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="w-4 h-4 text-gray-500"/>
                                                        <span className="text-gray-600">Earlier</span>
                                                    </>
                                                )}
                                            </h3>
                                            {notifications?.map((notification) => (
                                                <div
                                                    key={notification._id}
                                                    className={`flex items-start px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 cursor-pointer transition-all duration-200 relative
                                                        ${!notification.isRead ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}`}
                                                    onClick={() => handleNotificationClick(notification)}
                                                >
                                                    {!notification.isRead && (
                                                        <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                                                        </div>
                                                    )}
                                                    <Avatar className={`h-12 w-12 mr-4 ring-2 ring-offset-2 ${!notification.isRead ? 'ring-blue-400' : 'ring-gray-100'}`}>
                                                        <AvatarImage
                                                            src={notification.user.avatarUrl}
                                                            alt={notification.user.username}
                                                        />
                                                        <AvatarFallback className={`${!notification.isRead ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'} text-white`}>
                                                            {notification.user.username[0].toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm ${!notification.isRead ? 'text-blue-900 font-medium' : 'text-gray-900'}`}>
                                                            <span className="font-semibold">
                                                                {notification.user.username}
                                                            </span>{' '}
                                                            {notification.content}
                                                        </p>
                                                        <p className={`text-xs mt-1 flex items-center gap-1 
                                                            ${!notification.isRead ? 'text-blue-500' : 'text-gray-500'}`}>
                                                            <Clock className="w-3 h-3"/>
                                                            {extractTime(notification.createdAt)}
                                                        </p>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className={`h-8 w-8 p-0 ml-2 hover:bg-red-50 hover:text-red-500 transition-colors
                                                                    ${!notification.isRead ? 'text-blue-500' : 'text-gray-400'}`}
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuItem
                                                                onClick={(e) => handleDeleteClick(notification._id, e)}
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2"/>
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ))
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </div>

            <Alert
                title="Delete Notification"
                description="Are you sure you want to delete this notification?"
                isAlertDialogOpen={isAlertOpen}
                setIsAlertDialogOpen={setIsAlertOpen}
                handleCancelDiscard={() => setIsAlertOpen(false)}
                actionText="Delete"
                handleConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default Notification;
