import { useContext, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IoIosMore } from 'react-icons/io';
// import EditPostLogCustom from '@/components/post/EditPostLogCustom';
import Alert from '@/components/alert/Alert';
import { AuthContext } from '@/context/AuthContext'
import CommentDialog from '../dialog/CommentDialog';

const DropdownComment = ({ ...props }) => {
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
                    {props?.comment?.user?._id === authUser?._id ? (
                        <>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={handleOpenEditDialog} className="hover:cursor-pointer">Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsAlertDialogOpen(true)} className="hover:cursor-pointer">
                                {props?.loading ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    ) : (
                        <DropdownMenuLabel>No actions available</DropdownMenuLabel>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {
                isEditDialogOpen && (
                    <CommentDialog
                        isOpen={isEditDialogOpen}
                        onClose={handleCloseEditDialog}
                        onOpenChange={setIsEditDialogOpen}
                        onSubmit={props?.onEdit}
                        commentId={props?.comment?._id}
                        postId={props?.postId}
                        initialContent={props?.comment?.content}
                        mode="edit" />
                )
            }

            <Alert
                title="Delete Comment"
                description="Are you sure you want to delete this comment?"
                isAlertDialogOpen={isAlertDialogOpen}
                setIsAlertDialogOpen={setIsAlertDialogOpen}
                handleCancelDiscard={() => setIsAlertDialogOpen(false)}
                actionText="Delete"
                handleConfirm={() => props?.onDelete(props?.postId, props?.comment?._id)}
            />
        </>
    );
};

export default DropdownComment
