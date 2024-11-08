import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { extractTime } from '@/utils/extractTime';
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import Header from '@/components/header/Header';
import useNotification from '@/zustand/useNotification';
import Alert from '@/components/alert/Alert';
import useListenNotification from '@/hooks/useListenNotification';

const Notification = () => {
    useListenNotification()
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
            <Header props={{ path: -1, title: 'Notification' }} />
            <div className='flex-grow flex flex-col h-screen overflow-hidden'>
                <div className='bg-white rounded-tl-[28px] rounded-tr-[28px] flex-1 border-[1px] border-[#D5D5D5] flex flex-col overflow-hidden'>
                    <div className="flex flex-col h-full">
                        <ScrollArea className="h-[calc(100vh-120px)]">
                            {Object.entries(groupNotifications()).map(([group, notifications]) => (
                                notifications.length > 0 && (
                                    <div key={group} className="border-b last:border-b-0">
                                        <h3 className="px-6 py-3 text-base font-bold text-gray-700 bg-gray-50 border-y border-gray-200 flex items-center gap-2">
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
                                                className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleNotificationClick(notification)}
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
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">
                                                            {notification.user.username}
                                                        </span>{' '}
                                                        {notification.content}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {extractTime(notification.createdAt)}
                                                    </p>
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
                                                            onClick={(e) => handleDeleteClick(notification._id, e)}
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
