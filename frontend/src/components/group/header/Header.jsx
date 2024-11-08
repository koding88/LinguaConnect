import React from 'react'
import Back from '@/components/button/Back'
import { Button } from '@/components/ui/button'
import { BsThreeDots } from 'react-icons/bs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditGroupDialog from './dialogs/EditGroupDialog'
import DeleteGroupDialog from './dialogs/DeleteGroupDialog'
import ManageMembersDialog from './dialogs/ManageMembersDialog'
import { toast } from 'react-toastify'

const Header = ({
    props
}) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    const [isManageMembersOpen, setIsManageMembersOpen] = React.useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

    const {
        path,
        title,
        groupData,
        isAdmin,
        handleLeaveGroup: onLeaveGroup,
        handleEditGroup: onEditGroup,
        handleDeleteGroup: onDeleteGroup,
        handleUpdateMaxMembers: onUpdateMaxMembers,
        handleRemoveMember: onRemoveMember
    } = props

    const handleDeleteGroup = async () => {
        try {
            await onDeleteGroup()
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete group")
        }
    }

    return (
        <>
            <div className='flex items-center justify-between py-6'>
                <Back prop={path} />
                <h1 className='text-center text-black text-lg font-medium mr-8 flex-grow'>{title}</h1>
                <div className='flex items-center gap-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:rounded-full">
                                <BsThreeDots className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isAdmin ? (
                                <>
                                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                                        Edit Info
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsManageMembersOpen(true)}>
                                        Manage Members
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
                                        Delete Group
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem onClick={onLeaveGroup} className="text-red-600">
                                    Leave Group
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <EditGroupDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                groupData={groupData}
                onSubmit={onEditGroup}
            />

            <DeleteGroupDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDelete={handleDeleteGroup}
            />

            <ManageMembersDialog
                isOpen={isManageMembersOpen}
                onClose={() => setIsManageMembersOpen(false)}
                groupData={groupData}
                onUpdateMaxMembers={onUpdateMaxMembers}
                onRemoveMember={onRemoveMember}
            />
        </>
    )
}

export default Header
