import React from 'react'
import Back from '@/components/button/Back'
import { Button } from '@/components/ui/button'
import { BsThreeDots } from 'react-icons/bs'
import { FiEdit3, FiUsers, FiTrash2, FiLogOut } from 'react-icons/fi'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
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
            <div className='flex items-center justify-between py-6 px-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10 rounded-tr-xl rounded-tl-xl'>
                <Back prop={path} />
                <h1 className='text-center text-xl font-semibold mr-8 flex-grow bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient'>
                    {title}
                </h1>
                <div className='flex items-center gap-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:rounded-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                            >
                                <BsThreeDots className="h-5 w-5 text-gray-600" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 rounded-xl border border-gray-100 shadow-lg animate-in slide-in-from-top-2 duration-200"
                        >
                            {isAdmin ? (
                                <>
                                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                        Group Settings
                                    </div>
                                    <DropdownMenuItem
                                        onClick={() => setIsEditDialogOpen(true)}
                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 gap-2 py-2"
                                    >
                                        <FiEdit3 className="h-4 w-4" />
                                        <span>Edit Info</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setIsManageMembersOpen(true)}
                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 gap-2 py-2"
                                    >
                                        <FiUsers className="h-4 w-4" />
                                        <span>Manage Members</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1" />
                                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                        Danger Zone
                                    </div>
                                    <DropdownMenuItem
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                        className="text-red-600 hover:bg-red-50 focus:bg-red-50 gap-2 py-2"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                        <span>Delete Group</span>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem
                                    onClick={onLeaveGroup}
                                    className="text-red-600 hover:bg-red-50 focus:bg-red-50 gap-2 py-2"
                                >
                                    <FiLogOut className="h-4 w-4" />
                                    <span>Leave Group</span>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent shadow-sm" />

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
