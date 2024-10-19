import React, { useState, useContext } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IoIosMore } from 'react-icons/io';
import { AuthContext } from '@/context/AuthContext';
import EditPostLogCustom from '@/components/dialog/EditPostLogCustom';
import Alert from '../alert/Alert';

const DropdownCustom = ({ ...props }) => {
    const { authUser } = useContext(AuthContext);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const handleOpenEditDialog = () => setIsEditDialogOpen(true);
    const handleCloseEditDialog = () => setIsEditDialogOpen(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full transition-colors duration-200">
                        <IoIosMore className="h-6 w-6" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {props?.owner === authUser?._id && props?.canEdit && (
                        <>
                            <DropdownMenuItem onClick={handleOpenEditDialog} className="hover:cursor-pointer">Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsAlertDialogOpen(true)} className="hover:cursor-pointer">
                                {props?.loading ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    {props?.owner !== authUser?._id && (
                        <DropdownMenuItem>Report</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {isEditDialogOpen && (
                <EditPostLogCustom
                    user={authUser}
                    post={props?.post}
                    isOpen={isEditDialogOpen}
                    onEdit={props?.onEdit}
                    loading={props?.loading}
                    onClose={handleCloseEditDialog}
                />
            )}

            <Alert
                title="Delete Post"
                description="Are you sure you want to delete this post?"
                isAlertDialogOpen={isAlertDialogOpen}
                setIsAlertDialogOpen={setIsAlertDialogOpen}
                handleCancelDiscard={() => setIsAlertDialogOpen(false)}
                actionText="Delete"
                handleConfirm={() => props?.onDelete(props?.post?._id)}
            />
        </>
    );
};

export default DropdownCustom;
